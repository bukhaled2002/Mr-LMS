"use client";
import { PublicSingleCourseType } from "@/app/data-layer/courses/public-single-course";
import PreviewRichText from "@/components/rich-text-editor/PreviewRichText";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Separator } from "@/components/ui/separator";
import useConstructUrl from "@/hooks/useConstructUrl";
import {
  IconCategory,
  IconChartBar,
  IconChevronDown,
  IconClock,
  IconPlayerPlay,
} from "@tabler/icons-react";
import Image from "next/image";

export default function CourseDetails({
  course,
}: {
  course: PublicSingleCourseType;
}) {
  const imageUrl = useConstructUrl(course.fileKey || "");
  return (
    <div className="order-1 lg:col-span-2">
      <div className="relative aspect-video w-full overflow-auto rounded-xl shadow-lg">
        <Image
          src={imageUrl}
          alt={course.title}
          fill
          priority
          className="object-cover"
        />
        <div className="bg-gradient-to-t from-primary/20 to-transparent absolute inset-0 z-10"></div>
      </div>

      <div className="mt-8 space-y-6">
        <div className="space-y-4">
          <h1 className="text-4xl font-bold tracking-tight capitalize">
            {course.title}
          </h1>
          <p className="text-lg text-muted-foreground leading-relaxed line-clamp-2">
            {course.smallDescription}
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Badge className="flex items-center gap-1 px-3 py-1">
            <IconChartBar className="size-4" />
            <span>{course.level}</span>
          </Badge>
          <Badge className="flex items-center gap-1 px-3 py-1">
            <IconCategory className="size-4" />
            <span>{course.category}</span>
          </Badge>
          <Badge className="flex items-center gap-1 px-3 py-1">
            <IconClock className="size-4" />
            <span>{course.duration} hours</span>
          </Badge>
        </div>
        <Separator className="my-8" />
        <div className="space-y-6">
          <h2 className="text-3xl font-semibold tracking-tight">
            Course Description
          </h2>
          <PreviewRichText json={JSON.parse(course.description)} />
        </div>
        <div className="mt-12 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-3xl font-semibold tracking-tight">
              Course Content
            </h2>
            <div>
              {course.chapters.length} chapters |{" "}
              {course.chapters.reduce((total, ch) => {
                return total + ch.lessons.length;
              }, 0) || 0}{" "}
              Lessons
            </div>
          </div>
          <div className="space-y-4">
            {course.chapters.map((ch, index) => {
              return (
                <Collapsible defaultOpen={index === 0} key={ch.id}>
                  <Card className="p-0 overflow-hidden border-2 hover:shadow-md transition-all duration-200 gap-0">
                    <CollapsibleTrigger>
                      <CardContent className="p-6 hover:bg-muted/50 transition-colors">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <p className="flex size-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                              {index + 1}
                            </p>
                            <div>
                              <h3 className="text-xl font-semibold text-left">
                                {ch.title}
                              </h3>
                              <p className="text-sm text-muted-foreground mt-1 text-left">
                                {ch.lessons.length === 1
                                  ? `${ch.lessons.length} lesson`
                                  : `${ch.lessons.length} lessons`}{" "}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <Badge variant={"outline"}>
                              {ch.lessons.length === 1
                                ? `${ch.lessons.length} lesson`
                                : `${ch.lessons.length} lessons`}{" "}
                            </Badge>
                            <IconChevronDown className="size-4 text-muted-foreground" />
                          </div>
                        </div>
                      </CardContent>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <div className="border-t bg-muted/20">
                        <div className="p-6 pt-4 space-y-3">
                          {ch.lessons.map((lesson, index) => {
                            return (
                              <div
                                key={lesson.id}
                                className="flex gap-4 rounded-lg p-3 hover:bg-accent transition-colors group"
                              >
                                <div className="flex items-center justify-center size-8 bg-background border-2 border-primary/20 rounded-full">
                                  <IconPlayerPlay className="size-4 text-muted-foreground group-hover:text-primary transition-colors" />
                                </div>
                                <div className="flex-1">
                                  <p className="font-medium text-sm">
                                    {lesson.title}
                                  </p>
                                  <p className="text-xs text-muted-foreground mt-1">
                                    Lesson {index + 1}
                                  </p>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </CollapsibleContent>
                  </Card>
                </Collapsible>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
