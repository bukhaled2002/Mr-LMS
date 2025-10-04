import { prisma } from "@/lib/db";
import { requireUser } from "../user/require-user";

export async function getEnrolledCourses() {
  const session = await requireUser();
  const enrollments = await prisma.enrollment.findMany({
    where: { status: "Active", userId: session.user.id },
    select: {
      Courses: {
        select: {
          id: true,
          smallDescription: true,
          title: true,
          fileKey: true,
          level: true,
          duration: true,
          slug: true,
          price: true,
          category: true,
          chapters: {
            select: {
              id: true,
              lessons: {
                select: {
                  id: true,
                  lessonProgress: {
                    where: { userId: session.user.id },
                    select: {
                      completed: true,
                      id: true,
                      lessonId: true,
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  });

  return enrollments.map((enrollment) => enrollment.Courses);
}

export type EnrolledCourseType = Awaited<
  ReturnType<typeof getEnrolledCourses>
>[0];
