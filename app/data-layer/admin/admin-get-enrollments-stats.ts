"use server";

import { prisma } from "@/lib/db";
import { requireAdmin } from "./require-admin";

export async function adminGetEnrollmentsStats(): Promise<
  | {
      date: string;
      enrollment: number;
    }[]
  | void
> {
  await requireAdmin();

  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  const enrollments = await prisma.enrollment.findMany({
    where: { createdAt: { gte: thirtyDaysAgo } },
    select: { createdAt: true },
    orderBy: { createdAt: "asc" },
  });

  const lastMonth: {
    date: string;
    enrollment: number;
  }[] = [];

  for (let i = 29; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    const dateString = date.toISOString().split("T")[0];

    lastMonth.push({ date: dateString, enrollment: 0 });
  }
  console.log(lastMonth);
  enrollments.forEach((enrollment) => {
    const enrollmentDate = enrollment.createdAt.toISOString().split("T")[0];
    const datIndex = lastMonth.findIndex((d) => d.date === enrollmentDate);
    if (datIndex !== -1) {
      lastMonth[datIndex].enrollment += 1;
    }
  });
  console.log(lastMonth);
  return lastMonth;
}
