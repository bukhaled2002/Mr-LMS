import { PublicSingleCourseType } from "@/app/data-layer/courses/public-single-course";
import { isUserEnrolled } from "@/app/data-layer/user/is-user-enrolled";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  IconBook,
  IconCategory,
  IconChartBar,
  IconClock,
} from "@tabler/icons-react";
import { CheckIcon } from "lucide-react";
import Link from "next/link";
import { useTransition } from "react";
import { toast } from "sonner";
import EnrollmentButton from "./EnrollmentButton";

export default async function EnrollmentCard({
  course,
}: {
  course: PublicSingleCourseType;
}) {
  const isEnrolled = await isUserEnrolled(course.id);

  return (
    <div className="grid-cols-1 order-2">
      <div className="sticky top-20">
        <Card className="py-0">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-6">
              <span className="text-lg font-medium">Price:</span>
              <span className="text-xl font-bold text-primary">
                {new Intl.NumberFormat("en-Us", {
                  style: "currency",
                  currency: "USD",
                }).format(course.price)}
              </span>
            </div>

            <div className="space-y-4 mb-6 rounded-lg border p-4">
              <h4 className="font-medium">What you will get:</h4>
              <div className="flex flex-col gap-3">
                {/*  */}
                <div className="flex gap-4 items-center">
                  <div className="flex size-8 justify-center items-center rounded-full bg-primary/10 text-primary">
                    <IconClock className="size-4" />
                  </div>

                  <div>
                    <p className="text-sm font-medium">Course Duration</p>
                    <p className="text-sm text-muted-foreground">
                      {course.duration} hours
                    </p>
                  </div>
                </div>
                {/*  */}
                <div className="flex gap-4 items-center">
                  <div className="flex size-8 justify-center items-center rounded-full bg-primary/10 text-primary">
                    <IconCategory className="size-4" />
                  </div>

                  <div>
                    <p className="text-sm font-medium">Category</p>
                    <p className="text-sm text-muted-foreground">
                      {course.category}
                    </p>
                  </div>
                </div>
                {/*  */}
                <div className="flex gap-4 items-center">
                  <div className="flex size-8 justify-center items-center rounded-full bg-primary/10 text-primary">
                    <IconChartBar className="size-4" />
                  </div>

                  <div>
                    <p className="text-sm font-medium">Difficulty</p>
                    <p className="text-sm text-muted-foreground">
                      {course.level}
                    </p>
                  </div>
                </div>
                {/*  */}
                <div className="flex gap-4 items-center">
                  <div className="flex size-8 justify-center items-center rounded-full bg-primary/10 text-primary">
                    <IconBook className="size-4" />
                  </div>

                  <div>
                    <p className="text-sm font-medium">Total Lessons</p>
                    <p className="text-sm text-muted-foreground">
                      {course.chapters.reduce((total, ch) => {
                        return total + ch.lessons.length;
                      }, 0) || 0}
                      {" Lessons"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="mb-6 space-y-3">
              <h4>This course includes:</h4>
              <ul className="space-y-2">
                <li className="flex items-center gap-2 text-sm">
                  <div className="rounded-full p-1 bg-green-500/10 text-green-500">
                    <CheckIcon className="size-3" />
                  </div>
                  <span>Lifetime access</span>
                </li>
                <li className="flex items-center gap-2 text-sm">
                  <div className="rounded-full p-1 bg-green-500/10 text-green-500">
                    <CheckIcon className="size-3" />
                  </div>
                  <span>Access on mobile and desktop</span>
                </li>
                <li className="flex items-center gap-2 text-sm">
                  <div className="rounded-full p-1 bg-green-500/10 text-green-500">
                    <CheckIcon className="size-3" />
                  </div>
                  <span>Certificate on completion </span>
                </li>
              </ul>
            </div>
            <EnrollmentButton courseId={course.id} isEnrolled={isEnrolled} />
            <p className="text-center text-muted-foreground text-xs mt-3">
              30-day money-back gurantee
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
