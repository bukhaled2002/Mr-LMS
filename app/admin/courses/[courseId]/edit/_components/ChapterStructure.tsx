"use client";

import { SortableItem } from "@/components/sortable/SortableItem";
import { Button } from "@/components/ui/button";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { FileText, GripVertical } from "lucide-react";
import { DeleteLessonModal } from "./DeleteLessonModal";
import Link from "next/link";

export default function ChapterStructure({
  item,
  courseId,
}: {
  item: { lessons: { id: string; title: string }[]; id: string };
  courseId: string;
}) {
  return (
    <SortableContext
      items={item.lessons.map((lesson) => lesson.id)}
      strategy={verticalListSortingStrategy}
    >
      {item.lessons.map((lesson) => (
        <SortableItem
          key={lesson.id}
          id={lesson.id}
          data={{ type: "lesson", chapterId: item.id }}
        >
          {(lessonListeners) => (
            <div className="flex items-center justify-between p-2 hover:bg-accent rounded-sm">
              <div className="flex items-center gap-2">
                <Button variant={"ghost"} size={"icon"} {...lessonListeners}>
                  <GripVertical className="size-4 cursor-grab" />
                </Button>
                <FileText className="size-4" />
                <Link
                  href={`/admin/courses/${courseId}/${item.id}/${lesson.id}`}
                  className="hover:text-primary"
                >
                  {lesson.title}
                </Link>
              </div>
              <DeleteLessonModal
                chapterId={item.id}
                courseId={courseId}
                lessonId={lesson.id}
              />
            </div>
          )}
        </SortableItem>
      ))}
    </SortableContext>
  );
}
