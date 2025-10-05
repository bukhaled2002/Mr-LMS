"use server";
import { requireAdmin } from "@/app/data-layer/admin/require-admin";
import arcjet, { fixedWindow } from "@/lib/arcjet";
import { prisma } from "@/lib/db";
import { ApiResponse } from "@/lib/types";
import { request } from "@arcjet/next";
import { revalidatePath } from "next/cache";
const aj = arcjet.withRule(fixedWindow({ mode: "LIVE", max: 3, window: "5m" }));

export async function deleteCouse(couseId: string): Promise<ApiResponse> {
  const session = await requireAdmin();
  const req = await request();
  try {
    const decision = await aj.protect(req, { fingerprint: session.user.id });
    console.log(decision.reason);
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
    await prisma.courses.delete({ where: { id: couseId } });
    revalidatePath("/admin/courses");
    return { message: "Course deleted successfully", status: "success" };
  } catch {
    return { message: "Something went wrong", status: "error" };
  }
}
