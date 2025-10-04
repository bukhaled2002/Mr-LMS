import "server-only";

import { prisma } from "@/lib/db";
import { requireAdmin } from "./require-admin";
import { notFound } from "next/navigation";

export async function getAdminSingleCourse(courseId: string) {
  await requireAdmin();
  console.log(courseId);
  try {
    const course = await prisma.courses.findFirst({
      where: {
        // userId: session.user.id,
        id: courseId,
      },
      select: {
        category: true,
        createdAt: true,
        description: true,
        duration: true,
        fileKey: true,
        id: true,
        chapters: {
          select: {
            id: true,
            position: true,
            title: true,
            lessons: {
              select: { id: true, title: true, position: true },
              orderBy: { position: "asc" },
            },
          },
          orderBy: { position: "asc" },
        },
        level: true,
        price: true,
        slug: true,
        smallDescription: true,
        status: true,
        title: true,
        updatedAt: true,
        user: true,
        userId: true,
      },
    });
    if (!course) {
      return notFound();
    }
    return course;
  } catch (error) {
    console.log(error);
  }
}

export type AdminSinglCourseType = Awaited<
  ReturnType<typeof getAdminSingleCourse>
>;
export type AdminSingleCourseChaptersType =
  NonNullable<AdminSinglCourseType>["chapters"][0];

export type AdminSingleLessonType = NonNullable<
  AdminSingleCourseChaptersType["lessons"][0]
>;
