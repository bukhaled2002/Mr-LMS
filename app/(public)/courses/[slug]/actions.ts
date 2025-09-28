"use server";

import { requireUser } from "@/app/data-layer/user/require-user";
import arcjet, { fixedWindow } from "@/lib/arcjet";
import { prisma } from "@/lib/db";
import stripe from "@/lib/stripe";
import { ApiResponse } from "@/lib/types";
import { request } from "@arcjet/next";
import { redirect } from "next/navigation";

const aj = arcjet.withRule(fixedWindow({ max: 5, window: "1m", mode: "LIVE" }));

export async function enrollInCourse(
  courseId: string
): Promise<ApiResponse | never> {
  const session = await requireUser();
  const req = await request();
  let checkoutUrl: string;
  try {
    const decision = await aj.protect(req, { fingerprint: session.user.id });

    if (decision.isDenied()) {
      return {
        message: "Too many requests. Please try again later.",
        status: "error",
      };
    }
    const course = await prisma.courses.findUnique({
      where: { id: courseId },
      select: {
        id: true,
        title: true,
        price: true,
        slug: true,
        stripePriceId: true,
      },
    });
    if (!course) {
      return { message: "Course not found", status: "error" };
    }
    let stripeCustomerId: string;
    const userWithStripeCustomerId = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { stripeCustomerId: true },
    });
    if (userWithStripeCustomerId?.stripeCustomerId) {
      stripeCustomerId = userWithStripeCustomerId.stripeCustomerId;
    } else {
      const customer = await stripe.customers.create({
        email: session.user.email,
        name: session.user.name,
        metadata: {
          userId: session.user.id,
        },
      });
      stripeCustomerId = customer.id;
      await prisma.user.update({
        where: { id: session.user.id },
        data: { stripeCustomerId },
      });
    }

    const result = await prisma.$transaction(async (tx) => {
      const existingEnrollment = await tx.enrollment.findUnique({
        where: {
          userId_coursesId: { userId: session.user.id, coursesId: course.id },
        },
        select: { status: true, id: true },
      });
      if (existingEnrollment?.status === "Active") {
        return {
          status: "success",
          message: "Already enrolled in this course",
        };
      }
      let enrollment;
      if (existingEnrollment) {
        enrollment = await tx.enrollment.update({
          where: { id: existingEnrollment.id },
          data: {
            amount: course.price,
            status: "Pending",
            updatedAt: new Date(),
          },
        });
      } else {
        enrollment = await tx.enrollment.create({
          data: {
            amount: course.price,
            coursesId: course.id,
            userId: session.user.id,
            status: "Pending",
          },
        });
      }

      const checkoutSession = await stripe.checkout.sessions.create({
        customer: stripeCustomerId,
        line_items: [
          {
            price: course.stripePriceId as string,
            quantity: 1,
          },
        ],
        mode: "payment",
        success_url: `${process.env.BETTER_AUTH_URL}/payment/success`,
        cancel_url: `${process.env.BETTER_AUTH_URL}/payment/cancel`,
        metadata: {
          userId: session.user.id,
          courseId: course.id,
          enrollmentId: enrollment.id,
        },
      });

      return {
        enrollment,
        checkoutUrl: checkoutSession.url,
      };
    });

    checkoutUrl = result.checkoutUrl as string;
  } catch (error) {
    if (error instanceof stripe.errors.StripeError) {
      console.log(error);
      return { message: "Payment system error", status: "error" };
    }
    return { message: "Failed to enroll in course", status: "error" };
  }

  redirect(checkoutUrl);
}
