import { getAdminLesson } from "@/app/data-layer/admin/admin-get-lesson";
import { buttonVariants } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import EditLessonForm from "./_components/EditLessonForm";

type Props = Promise<{
  courseId: string;
  chapterId: string;
  lessonId: string;
}>;
export default async function Page({ params }: { params: Props }) {
  const { chapterId, courseId, lessonId } = await params;
  const lesson = await getAdminLesson({ lessondId: lessonId });
  console.log(lesson);
  return (
    <div className="space-y-6">
      <div>
        <Link
          className={buttonVariants({ variant: "outline" })}
          href={`/admin/courses/${courseId}/edit`}
        >
          <ArrowLeft className="size-4" />
          <span>Go Back</span>
        </Link>
      </div>
      <EditLessonForm chapterId={chapterId} courseId={courseId} data={lesson} />
    </div>
  );
}
