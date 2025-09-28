import { prisma } from "@/lib/db";
import { requireAdmin } from "./require-admin";

export async function adminGetRecentCourses() {
  const session = await requireAdmin();

  const courses = await prisma.courses.findMany({
    where: { userId: session.user.id },
    take: 2,
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
  });
  return courses;
}
