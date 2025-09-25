"use server";

import { prisma } from "@/lib/db";

export async function getAllCourses() {
  const data = await prisma.courses.findMany({
    where: { status: "Published" },
    select: {
      id: true,
      title: true,
      smallDescription: true,
      slug: true,
      price: true,
      duration: true,
      fileKey: true,
      level: true,
      category: true,
    },
    orderBy: { createdAt: "desc" },
  });
  return data;
}

export type PublicCourseType = Awaited<ReturnType<typeof getAllCourses>>[0];
