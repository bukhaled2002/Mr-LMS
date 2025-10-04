import "server-only";
import { requireUser } from "../user/require-user";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";

export async function getLessonContent(lessonId: string) {
  const session = await requireUser();

  try {
    const lesson = await prisma.lesson.findUnique({
      where: { id: lessonId },
      select: {
        id: true,
        title: true,
        description: true,
        videoUrlKey: true,
        thubnailUrlKey: true,
        position: true,
        lessonProgress: {
          where: { userId: session.user.id },
          select: { completed: true, lessonId: true },
        },
        Chapter: { select: { coursesId: true } },
      },
    });

    if (!lesson) {
      return notFound();
    }

    const enrollment = await prisma.enrollment.findUnique({
      where: {
        userId_coursesId: {
          coursesId: lesson.Chapter.coursesId,
          userId: session.user.id,
        },
      },
      select: { status: true },
    });

    if (!enrollment || enrollment.status !== "Active") {
      return notFound();
    }

    return lesson;
  } catch (error) {
    console.log(error);
    return notFound();
  }
}

export type LessonContentType = Awaited<ReturnType<typeof getLessonContent>>;
