"use server";

import { prisma } from "@/lib/db";
import { requireAdmin } from "./require-admin";

export async function getAdminCourses() {
  const session = await requireAdmin();
  try {
    const data = await prisma.courses.findMany({
      orderBy: { createdAt: "desc" },
      select: {
        title: true,
        id: true,
        smallDescription: true,
        duration: true,
        level: true,
        status: true,
        price: true,
        fileKey: true,
        slug: true,
      },
      where: { userId: session.user.id },
    });
    return data;
  } catch (error) {
    console.log(error);
    return [];
  }
}
export type AdminCourseType = Awaited<ReturnType<typeof getAdminCourses>>[0];
