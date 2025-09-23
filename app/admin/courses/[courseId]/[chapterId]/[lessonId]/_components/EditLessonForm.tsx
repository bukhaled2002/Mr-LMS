"use client";
import { AdminLessonType } from "@/app/data-layer/admin/admin-get-lesson";
import { lessonSchema, lessonSchemaType } from "@/lib/zodSchemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Editor from "@/components/rich-text-editor/Editor";
import Uploader from "@/components/file-uploader/Uploader";
import { useTransition } from "react";
import { toast } from "sonner";
import { updateLesson } from "../action";
export default function EditLessonForm({
  data,
  courseId,
  chapterId,
}: {
  data: AdminLessonType;
  courseId: string;
  chapterId: string;
}) {
  const [isPending, startTransition] = useTransition();
  const form = useForm<lessonSchemaType>({
    resolver: zodResolver(lessonSchema),
    defaultValues: {
      name: data?.title,
      chapterId,
      courseId,
      description: data?.description ?? undefined,
      thubnailUrlKey: data?.thubnailUrlKey ?? undefined,
      videoUrlKey: data?.videoUrlKey ?? undefined,
    },
  });

  // 2. Define a submit handler.
  function onSubmit(values: lessonSchemaType) {
    startTransition(async () => {
      try {
        const res = await updateLesson(values, data?.id as string);
        console.log(res);
        if (res.status === "success") {
          toast.success(res.message);
        } else if (res.status === "error") {
          console.log(res.message);
          toast.error("Cannot edit lesson, check your data");
          return;
        }
      } catch (error) {
        console.log(error);
        toast.error("Failed to create course, try again later");
      }
    });
  }
  return (
    <Card>
      <CardHeader>
        <CardTitle>Edit Lesson</CardTitle>
        <CardDescription>Make changes to your lesson here.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Your course title" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Editor field={field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="thubnailUrlKey"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Thubnail Image</FormLabel>
                  <FormControl>
                    <Uploader
                      fileType="image"
                      value={field.value || ""}
                      onChange={field.onChange}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="videoUrlKey"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Lesson Video</FormLabel>
                  <FormControl>
                    <Uploader
                      fileType="video"
                      value={field.value || ""}
                      onChange={field.onChange}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={isPending}>
              {isPending ? "Saving..." : "Save"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
