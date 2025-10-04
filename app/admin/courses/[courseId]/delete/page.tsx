"use client";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ArrowLeft, Loader2, Trash2 } from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import React, { useTransition } from "react";
import { deleteCouse } from "./actions";
import { toast } from "sonner";

export default function Page() {
  const [pending, setTransition] = useTransition();
  const router = useRouter();
  const { courseId } = useParams<{ courseId: string }>();
  async function onSubmit() {
    setTransition(async () => {
      try {
        const response = await deleteCouse(courseId);
        if (response.status === "error") {
          toast.error(response.message);
          return;
        }
        if (response.status === "success") {
          toast.success(response.message);
          router.push("/admin/courses");
          return;
        }
      } catch (error) {
        console.log(error);
        toast.error("Unexpected error occured, please try again later");
      }
    });
  }
  return (
    <div className="max-w-xl mx-auto w-full">
      <Card className="mt-40">
        <CardHeader>
          <CardTitle>Are you sure you want to delete this course?</CardTitle>
          <CardDescription>This action cannot be undone</CardDescription>
        </CardHeader>
        <CardContent className="flex justify-between items-center">
          <Link
            className={buttonVariants({ variant: "outline" })}
            href={`/admin/courses`}
          >
            <ArrowLeft />
            <span>Cancel</span>
          </Link>
          <Button variant={"destructive"} type="button" onClick={onSubmit}>
            {pending ? (
              <>
                <Loader2 className="animate-spin size-4" /> Deleting
              </>
            ) : (
              <>
                <Trash2 />
                Delete
              </>
            )}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
