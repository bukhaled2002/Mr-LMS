import "server-only";

import { prisma } from "@/lib/db";
import { requireAdmin } from "./require-admin";

export async function adminGetDashboardStats(): Promise<{
  data?: {
    totalSignups: number;
    totalCustomers: number;
    totalCourses: number;
    totalLessons: number;
  };
  status: "success" | "error";
  message: string;
}> {
  await requireAdmin();

  try {
    const [totalSignups, totalCustomers, totalCourses, totalLessons] =
      await Promise.all([
        prisma.user.count(),
        prisma.user.count({ where: { enrollments: { some: {} } } }),
        prisma.courses.count(),
        prisma.lesson.count(),
      ]);
    return {
      data: { totalSignups, totalCustomers, totalCourses, totalLessons },
      status: "success",
      message: "Stats fetched successfully",
    };
  } catch (error) {
    return {
      status: "error",
      message: "Failed to fetch stats",
    };
  }
}
