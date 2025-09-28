"use server";
import { prisma } from "@/lib/db";

export async function getSingleCourse(slug: string) {
  if (!slug) {
    throw new Error("Slug is required");
  }
  console.log(slug);
  const course = await prisma.courses.findUnique({
    where: { slug },
    select: {
      id: true,
      title: true,
      smallDescription: true,
      description: true,
      duration: true,
      level: true,
      price: true,
      fileKey: true,
      slug: true,
      createdAt: true,
      updatedAt: true,
      category: true,
      chapters: {
        select: {
          id: true,
          title: true,
          lessons: {
            select: { id: true, title: true },
            orderBy: { position: "asc" },
          },
        },
        orderBy: { position: "asc" },
      },
    },
  });

  if (!course) {
    throw new Error("Course not found");
  }
  console.log(course);
  return course;
}
export type PublicSingleCourseType = Awaited<
  ReturnType<typeof getSingleCourse>
>;
