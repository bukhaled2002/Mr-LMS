"use client";
import { LessonContentType } from "@/app/data-layer/courses/get-lesson-content";
import VideoPlayerComponent from "@/components/general/VideoPlayer";
import PreviewRichText from "@/components/rich-text-editor/PreviewRichText";
import { Button } from "@/components/ui/button";
import { CheckCircle, Loader2 } from "lucide-react";
import { markLessonAsComplete, updateLastViewedLesson } from "./action";
import { useEffect, useTransition } from "react";
import { toast } from "sonner";
import useConfetti from "@/hooks/use-confetti";

export default function LessonContent({
  lesson,
  courseSlug,
}: {
  lesson: LessonContentType;
  courseSlug: string;
}) {
  const [pending, startTransition] = useTransition();
  const { triggerConfetti } = useConfetti();
  useEffect(() => {
    updateLastViewedLesson(lesson.Chapter.coursesId, lesson.id);
  }, []);

  async function handleMarkAsComplete() {
    startTransition(async () => {
      try {
        console.log(lesson.id);
        const res = await markLessonAsComplete(lesson.id, courseSlug);
        if (res.status === "success") {
          toast.success("Lesson marked as complete");
          triggerConfetti();
        } else {
          toast.error(res.message);
        }
      } catch (error) {
        console.log(error);
        toast.error("Failed to mark lesson as complete");
      }
    });
  }
  return (
    <div className="flex flex-col h-full bg-background pl-6 pt-4">
      <VideoPlayerComponent
        videoUrlKey={lesson.videoUrlKey ?? ""}
        thubnailUrlKey={lesson.thubnailUrlKey ?? ""}
      />
      <div className="py-4 border-b">
        {lesson.lessonProgress.length > 0 ? (
          <Button variant={"outline"} type="button">
            <CheckCircle className="size-4 mr-2 text-green-500" />
            Completed
          </Button>
        ) : (
          <Button
            variant={"outline"}
            disabled={pending}
            type="button"
            onClick={handleMarkAsComplete}
          >
            <>
              {pending ? (
                <>
                  <Loader2 className="size-4 mr-2 text-green-500 animate-spin" />
                  Pending...{" "}
                </>
              ) : (
                <>
                  <CheckCircle className="size-4 mr-2 text-green-500" />
                  Mark as Complete
                </>
              )}
            </>
          </Button>
        )}
      </div>

      <div className="space-y-3 pt-3">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          {lesson.title}
        </h1>
        {lesson.description && (
          <PreviewRichText json={JSON.parse(lesson.description)} />
        )}
      </div>
    </div>
  );
}
