import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  chapterSchema,
  chapterSchemaType,
  lessonSchema,
  lessonSchemaType,
} from "@/lib/zodSchemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus } from "lucide-react";
import React, { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { createLesson } from "../action";
import { toast } from "sonner";
export default function CreateLessonModal({
  courseId,
  chapterId,
}: {
  courseId: string;
  chapterId: string;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [pending, setTransition] = useTransition();

  const form = useForm<lessonSchemaType>({
    resolver: zodResolver(lessonSchema),
    defaultValues: { courseId: courseId, chapterId: chapterId, name: "" },
  });
  function handleOpenChange(open: boolean) {
    setIsOpen(open);
  }
  async function onSubmit(values: lessonSchemaType) {
    setTransition(async () => {
      try {
        const response = await createLesson(values);
        if (response.status === "error") {
          toast.error(response.message);
        }
        if (response.status === "success") {
          toast.success(response.message);
          form.reset();
          setIsOpen(false);
        }
      } catch (error) {
        console.log(error);
        toast.error("Unexpected error occured, please try again later");
      }
    });
  }
  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <div className="p-2">
          <Button className="w-full" variant={"outline"}>
            Create new Course{" "}
          </Button>
        </div>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create Lesson</DialogTitle>
          <DialogDescription>
            what would you like to name your chapter?
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input placeholder="shadcn" {...field} />
                  </FormControl>
                  <FormDescription>
                    This is your public display name.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="submit" disabled={pending}>
                {pending ? "Saving..." : "Create course"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
