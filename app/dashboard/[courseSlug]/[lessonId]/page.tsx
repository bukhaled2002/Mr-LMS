import { getLessonContent } from "@/app/data-layer/courses/get-lesson-content";
import LessonContent from "./_components/LessonContent";

export default async function Page({
  params,
}: {
  params: { lessonId: string; courseSlug: string };
}) {
  const { lessonId, courseSlug } = await params;
  console.log(lessonId, courseSlug);

  const lesson = await getLessonContent(lessonId);
  console.log(lesson);
  return <LessonContent lesson={lesson} courseSlug={courseSlug} />;
}
