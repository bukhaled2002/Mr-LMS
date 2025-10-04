import { getCourseSidebarData } from "@/app/data-layer/courses/get-course-sidebar-data";
import { redirect } from "next/navigation";
import React from "react";

export default async function page({
  params,
}: {
  params: Promise<{ courseSlug: string }>;
}) {
  const { courseSlug } = await params;
  const courseSidebarData = await getCourseSidebarData(courseSlug);

  const lastViewedLessonId =
    courseSidebarData.enrollments[0].lastViewedLessonId;
  // const lastViewedLessonId =
  //   courseSidebarData.enrollments[0].lastViewedLessonId;
  console.log("lastViewedLessonId", lastViewedLessonId);
  if (lastViewedLessonId) {
    redirect(`/dashboard/${courseSlug}/${lastViewedLessonId}`);
  } else {
    redirect(
      `/dashboard/${courseSlug}/${courseSidebarData.chapters[0].lessons[0].id}`
    );
  }
  return <div>page</div>;
}
