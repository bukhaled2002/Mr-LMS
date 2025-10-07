import { getCourseSidebarData } from "@/app/data-layer/courses/get-course-sidebar-data";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { redirect } from "next/navigation";
import React from "react";

export default async function Page({
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
  } else if (courseSidebarData?.chapters[0]?.lessons.length > 0) {
    redirect(
      `/dashboard/${courseSlug}/${courseSidebarData.chapters[0].lessons[0].id}`
    );
  }
  return (
    <div className="h-screen flex flex-col items-center justify-center ">
      <Card className="max-w-sm w-full">
        <CardHeader>
          <CardTitle className="text-center"> No Lessons yet</CardTitle>
        </CardHeader>
      </Card>
    </div>
  );
}
