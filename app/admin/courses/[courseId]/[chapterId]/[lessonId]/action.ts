"use server";

import { requireAdmin } from "@/app/data-layer/admin/require-admin";
import { prisma } from "@/lib/db";
import { ApiResponse } from "@/lib/types";
import { lessonSchema, lessonSchemaType } from "@/lib/zodSchemas";

export async function updateLesson(
  data: lessonSchemaType,
  lessonId: string
): Promise<ApiResponse> {
  requireAdmin();
  const result = lessonSchema.safeParse(data);
  if (!result.success) {
    console.log(result.error);
    throw new Error("Invalid data");
  }
  try {
    await prisma.lesson.update({
      where: { id: lessonId },
      data: {
        title: data.name,
        description: data.description,
        thubnailUrlKey: data.thubnailUrlKey,
        videoUrlKey: data.videoUrlKey,
      },
    });
    return { message: "Lesson updated successfully", status: "success" };
  } catch (error) {
    console.log(error);
    return { message: "Something went wrong", status: "error" };
  }
}
