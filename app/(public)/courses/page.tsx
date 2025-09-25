import { getAllCourses } from "@/app/data-layer/courses/public-courses";
import CourseCard, { CourseCardSkelton } from "../_components/CourseCard";
import { Suspense } from "react";

export default function page() {
  return (
    <div className="mt-6">
      <div className=" flex flex-col space-y-2 mb-10">
        <h1 className="text-3xl font-bold md:text-4xl tracking-tight">
          Explore courses
        </h1>
        <p className="text-muted-foreground ">
          Discover our courses designed to help you ahcieve your goals
        </p>
      </div>
      <Suspense fallback={<Loading />}>
        <RenderCourses />
      </Suspense>
    </div>
  );
}
async function RenderCourses() {
  const courses = await getAllCourses();
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {courses.map((course) => (
        <CourseCard key={course.id} course={course} />
      ))}
    </div>
  );
}
function Loading() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {Array.from({ length: 3 }).map((_, index) => (
        <CourseCardSkelton key={index} />
      ))}
    </div>
  );
}
