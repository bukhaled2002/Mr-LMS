import { getAdminCourses } from "@/app/data-layer/admin/admin-get-courses";
import { buttonVariants } from "@/components/ui/button";
import Link from "next/link";
import AdminCourseCard, {
  AdminCouseCardSkelton,
} from "./_components/AdminCourseCard";
import EmptyState from "@/components/general/EmptyState";
import { Suspense } from "react";

export default function Page() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between ">
        <h1 className="text-2xl font-bold">Your Courses</h1>
        <Link className={buttonVariants()} href={"/admin/courses/create"}>
          Create Course
        </Link>
      </div>
      <Suspense fallback={<Loading />}>
        <RenderCourse />
      </Suspense>
    </div>
  );
}
async function RenderCourse() {
  const data = await getAdminCourses();
  return (
    <>
      {data.length === 0 ? (
        <EmptyState
          title="No courses found"
          description="No courses found in your data yet, create new course to get start"
          buttonText="Create Course"
          href="/admin/courses/create"
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-1 lg:grid-cols-2 gap-7">
          {data.map((course) => (
            <AdminCourseCard key={course.id} data={course} />
          ))}
        </div>
      )}
    </>
  );
}
function Loading() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-1 lg:grid-cols-2 gap-7">
      {Array.from({ length: 4 }).map((_, index) => (
        <AdminCouseCardSkelton key={index} />
      ))}
    </div>
  );
}
