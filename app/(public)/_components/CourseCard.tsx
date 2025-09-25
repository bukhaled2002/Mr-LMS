import { PublicCourseType } from "@/app/data-layer/courses/public-courses";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import useConstructUrl from "@/hooks/useConstructUrl";
import { School, TimerIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function CourseCard({ course }: { course: PublicCourseType }) {
  const constructedImg = useConstructUrl(course.fileKey);
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
        <div className="mt-4 flex items-center gap-x-5">
          <div className="flex items-center gap-2">
            <TimerIcon className="size-6 rounded-md text-primary p-1 bg-primary/10" />
            <p className="text-sm text-muted-foreground">{course.duration}h</p>
          </div>
          <div className="flex items-center gap-2">
            <School className="size-6 rounded-md text-primary p-1 bg-primary/10" />
            <p className="text-sm text-muted-foreground">{course.level}</p>
          </div>
        </div>
        <Link
          href={`/courses/${course.slug}`}
          className={buttonVariants({ className: "w-full mt-4" })}
        >
          Explore Course
        </Link>
      </CardContent>
    </Card>
  );
}

export function CourseCardSkelton() {
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
