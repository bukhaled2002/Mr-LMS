import { getSingleCourse } from "@/app/data-layer/courses/public-single-course";
import CourseDetails from "./_components/CourseDetails";
import EnrollmentCard from "./_components/EnrollmentCard";

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  {
    const { slug } = await params;
    const course = await getSingleCourse(slug);
    return (
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3 mt-5">
        <CourseDetails course={course} />
        <EnrollmentCard course={course} />
      </div>
    );
  }
}
