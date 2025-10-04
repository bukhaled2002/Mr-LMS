import EmptyState from "@/components/general/EmptyState";
import { getEnrolledCourses } from "../data-layer/courses/get-enrolled-courses";
import { getNotEnrolledCourses } from "../data-layer/courses/get-not-enrolled-courses";
import CourseCard from "../(public)/_components/CourseCard";
import CourseDashboardCard from "./_components/CourseDashboardCard";

export default async function Page() {
  const [enrolledCourses, notEnrolledCourses] = await Promise.all([
    getEnrolledCourses(),
    getNotEnrolledCourses(),
  ]);
  console.log(enrolledCourses, notEnrolledCourses);
  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold">Enrolled Courses</h1>
        <p className="text-muted-foreground">
          here you can see all the courses you have access to it
        </p>
        {enrolledCourses.length === 0 ? (
          <EmptyState
            title="No Courses Purchased"
            description="You are not enrolled in any course yet"
            buttonText="Enroll Now"
            href="/courses"
          />
        ) : (
          <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-6">
            {enrolledCourses.map((course) => (
              <CourseDashboardCard course={course} key={course.id} />
            ))}
          </div>
        )}
      </div>

      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold">Available Courses</h1>
        <p className="text-muted-foreground">
          here you can see all the courses that you can purchase
        </p>

        <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-6">
          {notEnrolledCourses.map((course) => (
            <CourseCard course={course} key={course.id} />
          ))}
        </div>
      </div>
    </div>
  );
}
