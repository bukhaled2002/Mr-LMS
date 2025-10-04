"use client";

import { Button, buttonVariants } from "@/components/ui/button";
import Link from "next/link";
import { useTransition } from "react";
import { toast } from "sonner";
import { enrollInCourse } from "../actions";
import { Loader } from "lucide-react";

export default function EnrollmentButton({
  courseId,
  isEnrolled,
  courseSlug,
}: {
  courseId: string;
  isEnrolled: boolean;
  courseSlug: string;
}) {
  const [pending, startTransition] = useTransition();
  const onSubmit = async () => {
    startTransition(async () => {
      try {
        await enrollInCourse(courseId);
      } catch (error) {
        console.log(error);
        toast.error("Failed to pay");
      }
    });
  };
  return (
    <>
      {" "}
      {isEnrolled ? (
        <Link
          className={buttonVariants({ className: "w-full" })}
          href={`/dashboard/${courseSlug}`}
        >
          Watch Course
        </Link>
      ) : (
        <Button className="w-full" onClick={onSubmit}>
          {pending ? (
            <>
              <Loader className="animate-spin size-4" /> Loading
            </>
          ) : (
            "Enroll Now"
          )}
        </Button>
      )}
    </>
  );
}
