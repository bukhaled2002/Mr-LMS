import { prisma } from "@/lib/db";
import stripe from "@/lib/stripe";
import { headers } from "next/headers";
import Stripe from "stripe";

export async function POST(req: Request) {
  console.log("the webhook was called");
  const body = await req.text();
  const headerList = await headers();
  console.log(body);

  const signature = await headerList.get("Stripe-Signature");
  if (!signature) {
    return new Response("Missing Stripe signature", { status: 400 });
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature!,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (error) {
    console.log(error);
    return new Response("Webhook Error", { status: 400 });
  }

  const session = event.data.object as Stripe.Checkout.Session;

  if (event.type === "checkout.session.completed") {
    const courseId = session.metadata?.courseId;
    const enrollmentId = session.metadata?.enrollmentId;
    const customer = session.customer;

    console.log("Session Metadata:", session.metadata);

    if (!courseId || !enrollmentId) {
      throw new Error("Missing metadata (courseId or enrollmentId)");
    }

    const user = await prisma.user.findUnique({
      where: { stripeCustomerId: customer as string },
    });
    if (!user) {
      throw new Error("No User Found");
    }
    await prisma.enrollment.update({
      where: { id: enrollmentId },
      data: {
        amount: session.amount_total as number,
        status: "Active",
      },
    });
  }
  return new Response(null, { status: 200 });
}
