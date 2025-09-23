"use server";

import { prisma } from "@/lib/db";
import { requireAdmin } from "./require-admin";

export async function getAdminLesson({ lessondId }: { lessondId: string }) {
  await requireAdmin();
  try {
    const data = await prisma.lesson.findUnique({
      select: {
        title: true,
        id: true,
        description: true,
        position: true,
        thubnailUrlKey: true,
        videoUrlKey: true,
      },
      where: { id: lessondId },
    });
    return data;
  } catch (error) {
    console.log(error);
    return undefined;
  }
}
export type AdminLessonType = Awaited<ReturnType<typeof getAdminLesson>>;
