"use server";
import { requireAdmin } from "@/app/data-layer/admin/require-admin";
import { prisma } from "@/lib/db";
import { ApiResponse } from "@/lib/types";
import {
  chapterSchema,
  chapterSchemaType,
  courseSchema,
  courseSchemaType,
  lessonSchema,
  lessonSchemaType,
} from "@/lib/zodSchemas";
import { revalidatePath } from "next/cache";

export async function editCourse(
  courseID: string,
  data: courseSchemaType
): Promise<ApiResponse> {
  const session = await requireAdmin();
  try {
    const result = courseSchema.safeParse(data);
    if (!result.success) {
      return { message: "data is not valid", status: "error" };
    }
    const res = await prisma.courses.update({
      where: { id: courseID, userId: session.user.id },
      data: { ...result.data },
    });
    console.log(res);
    return { message: "course edited successfull", status: "success" };
  } catch (error) {
    console.log(error);
    return { message: "course cannot be edited", status: "error" };
  }
}

export async function changeChaptersOrder({
  courseId,
  chapters,
}: {
  courseId: string;
  chapters: { chapterId: string; position: number }[];
}): Promise<ApiResponse> {
  await requireAdmin();
  console.log("chapters");
  console.log(chapters);
  try {
    const updatePromises = chapters.map(({ chapterId, position }) =>
      prisma.chapter.update({
        where: { id: chapterId, coursesId: courseId },
        data: { position: position },
      })
    );
    const res = await prisma.$transaction(updatePromises);
    console.log("respooo", res);

    revalidatePath(`/admin/courses/${courseId}/edit`);
    return { status: "success", message: "chapters ordered successfully" };
  } catch (error) {
    console.log(error);
    return { status: "error", message: "failed to order chapters" };
  }
}

export async function changeLessonsOrder({
  courseId,
  chapterId,
  lessons,
}: {
  courseId: string;
  chapterId: string;
  lessons: { lessonId: string; position: number }[];
}): Promise<ApiResponse> {
  await requireAdmin();
  try {
    if (!lessons || lessons.length === 0) {
      return { status: "error", message: "no lessons to reorder" };
    }
    const updates = lessons.map((lesson) =>
      prisma.lesson.update({
        where: { id: lesson.lessonId, chapterId: chapterId },
        data: { position: lesson.position },
      })
    );
    await prisma.$transaction(updates);

    revalidatePath(`/admin/courses/${courseId}/edit`);
    return { status: "success", message: "lessons ordered successfully" };
  } catch (error) {
    console.log(error);
    return { status: "error", message: "failed to order lessons" };
  }
}

export async function createChapter(
  values: chapterSchemaType
): Promise<ApiResponse> {
  const result = chapterSchema.safeParse(values);
  if (!result.success) {
    return { message: "data is not valid", status: "error" };
  }
  await requireAdmin();
  try {
    await prisma.$transaction(async (tx) => {
      const maxCount = (
        await tx.chapter.findFirst({
          where: { coursesId: result.data.courseId },
          select: { position: true },
          orderBy: { position: "desc" },
        })
      )?.position;
      await tx.chapter.create({
        data: {
          coursesId: result.data.courseId,
          title: result.data.name,
          position: maxCount ? maxCount + 1 : 0,
        },
      });
    });
    revalidatePath(`/admin/courses/${result.data.courseId}/edit`);
    return { message: "course created successfully", status: "success" };
  } catch (error) {
    console.log(error);
    return { message: "course cannot be created", status: "error" };
  }
}

export async function createLesson(
  values: lessonSchemaType
): Promise<ApiResponse> {
  const result = lessonSchema.safeParse(values);
  if (!result.success) {
    return { message: "data is not valid", status: "error" };
  }
  await requireAdmin();
  try {
    await prisma.$transaction(async (tx) => {
      const maxCount = (
        await tx.lesson.findFirst({
          where: { chapterId: result.data.chapterId },
          select: { position: true },
          orderBy: { position: "desc" },
        })
      )?.position;
      await tx.lesson.create({
        data: {
          chapterId: result.data.chapterId,
          title: result.data.name,
          position: maxCount ? maxCount + 1 : 0,
        },
      });
    });
    revalidatePath(`/admin/courses/${result.data.courseId}/edit`);
    return { message: "lesson created successfully", status: "success" };
  } catch (error) {
    console.log(error);
    return { message: "lesson cannot be created", status: "error" };
  }
}

export async function deleteLesson({
  chapterId,
  lessonId,
  courseId,
}: {
  chapterId: string;
  lessonId: string;
  courseId: string;
}): Promise<ApiResponse> {
  await requireAdmin();
  try {
    const chapter = await prisma.chapter.findUnique({
      where: { id: chapterId },
      select: {
        lessons: {
          orderBy: { position: "asc" },
          select: { id: true, position: true },
        },
      },
    });

    if (!chapter) {
      return { message: "chapter not found", status: "error" };
    }

    const filteredLessons = chapter.lessons.filter(
      (lesson) => lesson.id !== lessonId
    );
    const updates = filteredLessons.map((lesson, index) => {
      return prisma.lesson.update({
        where: { id: lesson.id },
        data: { position: index + 1 },
      });
    });

    await prisma.$transaction([
      ...updates,
      prisma.lesson.delete({ where: { id: lessonId, chapterId } }),
    ]);

    revalidatePath(`/admin/courses/${courseId}/edit`);

    return { message: "lesson deleted successfully", status: "success" };
  } catch (error) {
    console.log(error);
    return { message: "lesson cannot be deleted", status: "error" };
  }
}
export async function deleteChapter({
  chapterId,
  courseId,
}: {
  chapterId: string;
  courseId: string;
}): Promise<ApiResponse> {
  await requireAdmin();
  try {
    const course = await prisma.courses.findUnique({
      where: { id: courseId },
      select: {
        chapters: {
          orderBy: { position: "asc" },
          select: { id: true, position: true },
        },
      },
    });

    if (!course) {
      return { message: "course not found", status: "error" };
    }

    const filteredchapters = course.chapters.filter(
      (chapter) => chapter.id !== chapterId
    );
    const updates = filteredchapters.map((chapter, index) => {
      return prisma.chapter.update({
        where: { id: chapter.id },
        data: { position: index + 1 },
      });
    });

    await prisma.$transaction([
      ...updates,
      prisma.chapter.delete({ where: { id: chapterId } }),
    ]);

    revalidatePath(`/admin/courses/${courseId}/edit`);

    return { message: "chapter deleted successfully", status: "success" };
  } catch (error) {
    console.log(error);

    return { message: "chapter cannot be deleted", status: "error" };
  }
}
