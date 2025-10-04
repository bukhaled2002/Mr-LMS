"use client";
import { useEffect, useState } from "react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";

import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";

import { AdminSinglCourseType } from "@/app/data-layer/admin/admin-get-course";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SortableItem } from "@/components/sortable/SortableItem";
import { Button } from "@/components/ui/button";
import {
  ChevronDown,
  ChevronRight,
  FileText,
  GripVertical,
  Trash2,
} from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import Link from "next/link";
import { toast } from "sonner";
import CreateChapterModal from "./CreateChapterModal";
import { changeChaptersOrder, changeLessonsOrder } from "../action";
import { DeleteLessonModal } from "./DeleteLessonModal";
import CreateLessonModal from "./CreateLessonModal";
import { DeleteChapterModal } from "./DeleteChapter";

export default function CourseStructure({
  course,
}: {
  course: AdminSinglCourseType;
}) {
  const initialItems =
    course?.chapters.map((chapter) => ({
      id: chapter.id,
      title: chapter.title,
      order: chapter.position,
      isOpen: true,
      lessons: chapter.lessons.map((lesson) => ({
        id: lesson.id,
        title: lesson.title,
        order: lesson.position,
      })),
    })) || [];
  const [items, setItems] = useState(initialItems);

  useEffect(() => {
    setItems((prev) => {
      const updatedItems =
        course?.chapters.map((chapter) => ({
          isOpen: prev.find((ch) => ch.id === chapter.id)?.isOpen ?? true,
          id: chapter.id,
          title: chapter.title,
          order: chapter.position,
          lessons: chapter.lessons.map((lesson) => ({
            id: lesson.id,
            title: lesson.title,
            order: lesson.position,
          })),
        })) || [];

      return updatedItems;
    });
  }, [course]);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );
  async function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    console.log(event);
    if (!over || active.id === over.id) {
      return;
    }
    const activeId = active.id;
    const overId = over.id;
    const activeType = active.data.current?.type as "chapter" | "lesson";
    const overType = over.data.current?.type as "chapter" | "lesson";
    const courseId = course?.id;

    if (activeType === "chapter") {
      let targetChapterId = null;
      if (overType === "chapter") {
        targetChapterId = overId;
      } else if (overType === "lesson") {
        targetChapterId = over.data.current?.chapterId ?? null;
      }
      if (!targetChapterId) {
        toast.error("Could not determine the chapter for reordering");
        return;
      }
      const oldIndex = items.findIndex((item) => item.id === activeId);
      const newIndex = items.findIndex((item) => item.id === targetChapterId);
      if (oldIndex === -1 || newIndex === -1) {
        toast.error("Could not find chapter index for reordering");
        return;
      }
      const newItems = arrayMove(items, oldIndex, newIndex);
      const updatedChaptersOrder = newItems.map((chapter, index) => ({
        ...chapter,
        order: index + 1,
      }));
      const oldItems = [...items];
      const updatedChapters = changeChaptersOrder({
        chapters: updatedChaptersOrder.map((chapter) => ({
          chapterId: chapter.id,
          position: chapter.order,
        })),
        courseId: courseId as string,
      });
      toast.promise(updatedChapters, {
        loading: "Redordering chapters",
        success: (response) => {
          if (response.status === "error") {
            throw new Error(response.message);
          }
          return "chapter ordered successfully";
        },
        error: (err) => {
          setItems(oldItems);
          return "Error in ordering chapters";
        },
      });

      setItems(updatedChaptersOrder);
    }
    if (activeType === "lesson" && overType === "lesson") {
      const chapterId = active.data.current?.chapterId;
      const overChapterId = over.data.current?.chapterId;
      if (!chapterId || chapterId !== overChapterId) {
        toast.error("Cannot move lessons between chapters");
        return;
      }

      const chapterIndex = items.findIndex(
        (chapter) => chapter.id === chapterId
      );
      if (chapterIndex === -1) {
        toast.error("Could not find chapter for reordering lessons");
        return;
      }
      const chapterToUpdate = items[chapterIndex];
      console.log(chapterToUpdate);
      const oldLessonIndex = chapterToUpdate.lessons.findIndex(
        (lesson) => lesson.id === activeId
      );
      const newLessonIndex = chapterToUpdate.lessons.findIndex(
        (lesson) => lesson.id === overId
      );
      if (oldLessonIndex === -1 || newLessonIndex === -1) {
        toast.error("Could not find lesson index for reordering");
        return;
      }
      const newLessonsOrder = arrayMove(
        chapterToUpdate.lessons,
        oldLessonIndex,
        newLessonIndex
      );

      const updatedLessonForState = newLessonsOrder.map((lesson, index) => ({
        ...lesson,
        order: index + 1,
      }));
      const newItems = [...items];
      newItems[chapterIndex] = {
        ...chapterToUpdate,
        lessons: updatedLessonForState,
      };
      const oldItems = [...items];
      const updatedLessons = changeLessonsOrder({
        chapterId: chapterId as string,
        lessons: updatedLessonForState.map((lesson) => ({
          lessonId: lesson.id,
          position: lesson.order,
        })),
        courseId: courseId as string,
      });
      setItems(newItems);
      if (courseId) {
        toast.promise(updatedLessons, {
          loading: "Redordering lessons",
          success: (response) => {
            if (response.status === "success") return response.message;
            throw new Error(response.message);
          },
          error: (err) => {
            setItems(oldItems);
            return "Error in ordering lessons";
          },
        });
      }
    }
  }

  const toggleChapter = (chapterId: string) => {
    setItems(
      items.map((chapter) =>
        chapter.id === chapterId
          ? { ...chapter, isOpen: !chapter.isOpen }
          : chapter
      )
    );
  };
  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <Card>
        <CardHeader className="flex flex-row items-center justify-between border-b border-border">
          <CardTitle>Chapters</CardTitle>
          <CreateChapterModal courseId={course?.id as string} />
        </CardHeader>
        <CardContent className="space-y-8">
          <SortableContext
            items={items.map((ch) => ch.id)}
            strategy={verticalListSortingStrategy}
          >
            {items.map((item) => (
              <SortableItem
                key={item.id}
                id={item.id}
                data={{ type: "chapter", chapterId: item.id }}
              >
                {(listeners) => (
                  <Card>
                    <Collapsible
                      open={item.isOpen}
                      onOpenChange={() => toggleChapter(item.id)}
                    >
                      <div className="flex items-center justify-between p-3 border-b border-border">
                        <div className="flex items-center gap-2 opacity-60 hover:opacity-100">
                          <Button
                            variant={"ghost"}
                            size={"icon"}
                            className="cursor-grab"
                            {...listeners}
                          >
                            <GripVertical className="size-4" />
                          </Button>
                          <CollapsibleTrigger asChild>
                            <Button variant={"ghost"} size={"icon"}>
                              {item.isOpen ? (
                                <ChevronDown className="size-5" />
                              ) : (
                                <ChevronRight className="size-5" />
                              )}
                            </Button>
                          </CollapsibleTrigger>
                          <p className="cursor-pointer hover:text-primary">
                            {item.title}
                          </p>
                        </div>
                        <DeleteChapterModal
                          chapterId={item.id}
                          courseId={course?.id as string}
                        />
                      </div>
                      <CollapsibleContent>
                        <div className="p-1">
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
                                      <Button
                                        variant={"ghost"}
                                        size={"icon"}
                                        {...lessonListeners}
                                      >
                                        <GripVertical className="size-4 cursor-grab" />
                                      </Button>
                                      <FileText className="size-4" />
                                      <Link
                                        href={`/admin/courses/${course?.id}/${item.id}/${lesson.id}`}
                                        className="hover:text-primary"
                                      >
                                        {lesson.title}
                                      </Link>
                                    </div>
                                    <DeleteLessonModal
                                      chapterId={item.id}
                                      courseId={course?.id as string}
                                      lessonId={lesson.id}
                                    />
                                  </div>
                                )}
                              </SortableItem>
                            ))}
                          </SortableContext>
                          <CreateLessonModal
                            chapterId={item.id}
                            courseId={course?.id as string}
                          />
                        </div>
                      </CollapsibleContent>
                    </Collapsible>
                  </Card>
                )}
              </SortableItem>
            ))}
          </SortableContext>
        </CardContent>
      </Card>
    </DndContext>
  );
}
