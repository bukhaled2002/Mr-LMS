"use server";
import { requireAdmin } from "@/app/data-layer/admin/require-admin";
import { prisma } from "@/lib/db";
import { ApiResponse } from "@/lib/types";
import { revalidatePath } from "next/cache";

export async function deleteCouse(couseId: string): Promise<ApiResponse> {
  await requireAdmin();
  try {
    await prisma.courses.delete({ where: { id: couseId } });
    revalidatePath("/admin/courses");
    return { message: "Course deleted successfully", status: "success" };
  } catch {
    return { message: "Something went wrong", status: "error" };
  }
}
