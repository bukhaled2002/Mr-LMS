import { getCourseSidebarData } from "@/app/data-layer/courses/get-course-sidebar-data";
import CourseSidebar from "./_components/CourseSidebar";

export default async function Layout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ courseSlug: string }>;
}) {
  const { courseSlug } = await params;
  const courseSidebarData = await getCourseSidebarData(courseSlug);
  return (
    <div className="flex flex-1">
      <div className="w-80 border-r border-border shrink-0 ">
        <CourseSidebar course={courseSidebarData} />
      </div>
      <div className="flex-1 overflow-hidden">{children}</div>
    </div>
  );
}
