"use client";

import { EnrolledCourseType } from "@/app/data-layer/courses/get-enrolled-courses";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import useCourseProgress from "@/hooks/use-course-progress";
import useConstructUrl from "@/hooks/useConstructUrl";
import Image from "next/image";
import Link from "next/link";

export default function CourseDashboardCard({
  course,
}: {
  course: EnrolledCourseType;
}) {
  const constructedImg = useConstructUrl(course.fileKey);
  const { completedLessons, progress, totalLessons } = useCourseProgress({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    courseData: course as any,
  });
  return (
    <Card className="group relative py-0 gap-0 overflow-hidden">
      {/* dropdown */}
      <Badge className="absolute top-2 right-2 z-10">{course.category}</Badge>
      <Image
        src={constructedImg}
        alt={course.title}
        height={400}
        width={600}
        className="w-full h-full object-cover rounded-t-lg aspect-video"
      />
      <CardContent className="p-5">
        <Link
          href={`/courses/${course.slug}`}
          className="font-medium text-lg line-clamp-2 hover:underline group-hover:text-primary transition-colors"
        >
          {course.title}
        </Link>
        <p className="line-clamp-2 text-sm text-muted-foreground leading-tight mt-2">
          {course.smallDescription}
        </p>
        <div className="space-y-4 mt-4">
          <div className="flex justify-between">
            <p>Progress: </p>
            <p className="font-medium">{progress}%</p>
          </div>
          <Progress value={progress} className="h-1.5" />
          <p className="text-xs text-muted-foreground mt-1">
            {completedLessons} of {totalLessons} lessons completed
          </p>
        </div>
        <Link
          href={`/dashboard/${course.slug}`}
          className={buttonVariants({ className: "w-full mt-4" })}
        >
          Learn More
        </Link>
      </CardContent>
    </Card>
  );
}

export function CourseDashboardCardSkelton() {
  return (
    <Card className="group relative py-0 gap-0">
      <div className="absolute top-2 right-2 z-10 flex items-center gap-2">
        <Skeleton className="h-6 w-16 rounded-full" />
        <Skeleton className="size-8 rounded-md" />
      </div>
      <div className="w-full rounded-t-lg aspect-video h-[250px] object-cover"></div>
      <CardContent className="p-4">
        <Skeleton className="h-6 w-3/4 mb-2 rounded" />
        <Skeleton className="h-4 w-full mb-2 rounded" />
        <div className="mt-4 flex items-center gap-x-5">
          <div className="flex items-center gap-x-2">
            <Skeleton className="size-6 rounded-md" />
            <Skeleton className="h-4 rounded" />
          </div>
          <div className="flex items-center gap-x-2">
            <Skeleton className="size-6 rounded-md" />
            <Skeleton className="h-4 rounded" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
