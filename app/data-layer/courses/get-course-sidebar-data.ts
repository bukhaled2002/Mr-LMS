import "server-only";

import { prisma } from "@/lib/db";
import { requireUser } from "../user/require-user";
import { notFound } from "next/navigation";

export async function getCourseSidebarData(slug: string) {
  const session = await requireUser();

  const courseSideBarData = await prisma.courses.findUnique({
    where: { slug },
    select: {
      id: true,
      title: true,
      fileKey: true,
      duration: true,
      enrollments: { select: { lastViewedLessonId: true } },
      level: true,
      slug: true,
      category: true,
      chapters: {
        select: {
          id: true,
          title: true,
          position: true,
          lessons: {
            select: {
              id: true,
              title: true,
              position: true,
              description: true,
              lessonProgress: {
                where: { userId: session.user.id },
                select: { completed: true, lessonId: true, id: true },
              },
            },
            orderBy: { position: "asc" },
          },
        },
        orderBy: { position: "asc" },
      },
    },
  });

  if (!courseSideBarData) {
    return notFound();
  }

  //   check if not enrolled
  const enrollment = await prisma.enrollment.findUnique({
    where: {
      userId_coursesId: {
        userId: session.user.id,
        coursesId: courseSideBarData.id,
      },
    },
    select: { status: true },
  });
  if (!enrollment || enrollment.status !== "Active") {
    return notFound();
  }
  return courseSideBarData;
}

export type CourseSideBarDataType = Awaited<
  ReturnType<typeof getCourseSidebarData>
>;
