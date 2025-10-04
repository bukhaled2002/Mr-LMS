"use server";

import { requireUser } from "@/app/data-layer/user/require-user";
import { prisma } from "@/lib/db";
import { ApiResponse } from "@/lib/types";
import { revalidatePath } from "next/cache";

export async function updateLastViewedLesson(
  courseId: string,
  lessonId: string
) {
  const session = await requireUser();
  await prisma.enrollment.update({
    where: {
      userId_coursesId: { coursesId: courseId, userId: session.user.id },
    },
    data: {
      lastViewedLessonId: lessonId,
    },
  });
}

export async function markLessonAsComplete(
  lessonId: string,
  courseSlug: string
): Promise<ApiResponse> {
  const session = await requireUser();
  try {
    console.log(session.user.id, lessonId);
    // await prisma.lessonProgress.upsert({
    //   where: { userId_lessonId: { userId: session.user.id, lessonId } },
    //   update: { completed: true },
    //   create: {
    //     userId: session.user.id,
    //     lessonId,
    //     completed: true,
    //   },
    // });

    try {
      await prisma.lessonProgress.upsert({
        where: { userId_lessonId: { userId: session.user.id, lessonId } },
        update: { completed: true },

        create: {
          userId: session.user.id,
          lessonId,
          completed: true,
        },
      });
      revalidatePath(`/dashboard/${courseSlug}/${lessonId}`);

      return { status: "success", message: "lesson marked as complete" };
    } catch (error) {
      console.log(error);
      return { status: "error", message: "internal error" };
    }
  } catch (error) {
    console.log(error);
    return { status: "error", message: "failed to update lesson as complete" };
  }
}
