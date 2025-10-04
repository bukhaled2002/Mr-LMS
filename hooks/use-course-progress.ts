"use client";
import { CourseSideBarDataType } from "@/app/data-layer/courses/get-course-sidebar-data";
import { useMemo } from "react";

export default function useCourseProgress({
  courseData,
}: {
  courseData: CourseSideBarDataType;
}) {
  return useMemo(() => {
    let totalLessons = 0;
    let completedLessons = 0;
    courseData.chapters.forEach((chapter) => {
      chapter.lessons.forEach((lesson) => {
        totalLessons += 1;

        const isCompleted = lesson.lessonProgress.some(
          (progress) => progress.lessonId === lesson.id && progress.completed
        );
        if (isCompleted) {
          completedLessons += 1;
        }
      });
    });

    const progress =
      totalLessons === 0
        ? 0
        : Math.round((completedLessons / totalLessons) * 100);
    return {
      totalLessons,
      completedLessons,
      progress,
    };
  }, [courseData.chapters]);
}
