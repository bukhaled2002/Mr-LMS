import { CourseSideBarDataType } from "@/app/data-layer/courses/get-course-sidebar-data";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Check, Play } from "lucide-react";
import Link from "next/link";
import React from "react";

export default function LessonItem({
  lesson,
  slug,
  isActive,
  isCompleted = false,
}: {
  lesson: CourseSideBarDataType["chapters"][0]["lessons"][0];
  slug: string;
  isActive: boolean;
  isCompleted?: boolean;
}) {
  return (
    <Link
      href={`/dashboard/${slug}/${lesson.id}`}
      className={buttonVariants({
        variant: isCompleted ? "secondary" : "outline",
        className: cn(
          "w-full justify-start p-2.5 h-auto transition-all",
          isCompleted &&
            "bg-green-100 dark:bg-green-900/30 border-green-300 dark:border-green-700 hover:bg-green-200-200/50 dark:hover:bg-green-900/50 text-green-800 dark:text-green-200",
          isActive &&
            !isCompleted &&
            "bg-primary/10 dark:bg-primary/20 border-primary/50 hover:bg-primary/20 dark:hover:bg-primary/30 text-primary"
        ),
      })}
    >
      <div className="flex items-center gap-2.5 w-full min-w-0">
        <div className="shrink-0">
          {isCompleted ? (
            <div className="size-5 bg-green-600 dark:bg-green-500 flex items-center justify-center rounded-full">
              <Check className="size-3" />
            </div>
          ) : (
            <div
              className={cn(
                "rounded-full size-5 border-2 bg-background flex justify-center items-center",
                isActive
                  ? "border-primary bg-primary/10 dark:bg-primary/20"
                  : "text-muted-foreground"
              )}
            >
              <Play
                className={cn(
                  "size-2.5 fill-current",
                  isActive ? "text-primary" : "text-muted-foreground"
                )}
              />
            </div>
          )}
        </div>
        <div className="flex-1 text-left">
          <p
            className={cn(
              "text-xs font-medium truncate",
              isCompleted
                ? "text-green-800 dark:text-green-100"
                : isActive
                ? "text-primary font-semibold"
                : "text-foreground"
            )}
          >
            {lesson.position}. {lesson.title}
          </p>
          {isCompleted && isActive && (
            <p className="text-[10px] text-green-700 dark:text-green-300 font-medium">
              Completed
            </p>
          )}
          {!isCompleted && isActive && (
            <p className="text-[10px] text-primary font-medium">
              Currently Watching
            </p>
          )}
        </div>
      </div>
    </Link>
  );
}
