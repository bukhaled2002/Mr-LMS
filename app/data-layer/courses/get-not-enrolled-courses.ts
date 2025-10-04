import { prisma } from "@/lib/db";
import { requireUser } from "../user/require-user";

export async function getNotEnrolledCourses() {
  const session = await requireUser();
  const enrollments = await prisma.enrollment.findMany({
    where: { userId: session.user.id, status: "Active" },
    select: {
      coursesId: true,
    },
  });

  const enrolledCourseIds = enrollments.map(
    (enrollment) => enrollment.coursesId
  );

  const courses = await prisma.courses.findMany({
    where: {
      id: {
        notIn: enrolledCourseIds,
      },
    },
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
            select: { id: true },
          },
        },
      },
    },
  });
  return courses;
}
