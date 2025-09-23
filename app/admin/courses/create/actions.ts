"use server";

import { requireAdmin } from "@/app/data-layer/admin/require-admin";
import arcjet, { detectBot, fixedWindow } from "@/lib/arcjet";
import { prisma } from "@/lib/db";
import { ApiResponse } from "@/lib/types";
import { courseSchema, courseSchemaType } from "@/lib/zodSchemas";
import { request } from "@arcjet/next";
const aj = arcjet
  .withRule(detectBot({ mode: "LIVE", allow: [] }))
  .withRule(fixedWindow({ mode: "LIVE", max: 2, window: "5m" }));

export async function createCourse(
  values: courseSchemaType
): Promise<ApiResponse> {
  const session = await requireAdmin();
  try {
    const req = await request();
    const decision = await aj.protect(req, { fingerprint: session.user.id });
    if (decision.isDenied()) {
      if (decision.reason.isRateLimit()) {
        return {
          status: "error",
          message:
            "Looks like you are blocked due to rate limiting, please wait and try again later ",
        };
      }
      if (decision.reason.isBot()) {
        return {
          status: "error",
          message:
            "Looks like you are bot, you are not allowed to do actions! \nif this is a mistake contact our support",
        };
      }
    }
    const validation = courseSchema.safeParse(values);
    if (!validation.success) {
      return { status: "error", message: "Invalid data" };
    }

    await prisma.courses.create({
      data: { ...validation.data, userId: session?.user.id as string },
    });

    return { status: "success", message: "Course created successfully" };
  } catch (error) {
    console.log(error);
    return { status: "error", message: "Error in Creating course" };
  }
}
