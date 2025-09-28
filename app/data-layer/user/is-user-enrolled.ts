import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { headers } from "next/headers";

export async function isUserEnrolled(courseId: string): Promise<boolean> {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) {
    return false;
  }
  const enrollment = await prisma.enrollment.findUnique({
    where: {
      userId_coursesId: { userId: session.user.id, coursesId: courseId },
    },
    select: { status: true },
  });

  if (enrollment?.status === "Active") {
    return true;
  }
  return false;
}
