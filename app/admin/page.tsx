import { SectionCards } from "@/components/sidebar/section-cards";
import { ChartAreaInteractive } from "@/components/sidebar/chart-area-interactive";
import { adminGetEnrollmentsStats } from "../data-layer/admin/admin-get-enrollments-stats";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { adminGetRecentCourses } from "../data-layer/admin/admin-get-recent-courses";
import EmptyState from "@/components/general/EmptyState";
import AdminCourseCard, {
  AdminCouseCardSkelton,
} from "./courses/_components/AdminCourseCard";
import { Suspense } from "react";
export default async function page() {
  const statsData = await adminGetEnrollmentsStats();
  return (
    <>
      <SectionCards />
      <ChartAreaInteractive data={statsData || []} />
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Recent Courses</h2>
          <Link
            className={buttonVariants({ variant: "outline" })}
            href={"/admin/courses"}
          >
            View All Courses
          </Link>
        </div>
        <Suspense fallback={<Loading />}>
          <RenderRecentCourse />
        </Suspense>
      </div>
    </>
  );
}

async function RenderRecentCourse() {
  const data = await adminGetRecentCourses();

  if (data.length === 0) {
    return (
      <EmptyState
        buttonText="Create new course"
        href="/admin/courses/create"
        title="No courses found"
        description="You don't have courses yet, please create a new one to start working"
      />
    );
  }
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {data.map((course) => (
        <AdminCourseCard key={course.id} data={course} />
      ))}
    </div>
  );
}

export function Loading() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {Array.from({ length: 2 }).map((_, idx) => (
        <AdminCouseCardSkelton key={idx} />
      ))}
    </div>
  );
}
