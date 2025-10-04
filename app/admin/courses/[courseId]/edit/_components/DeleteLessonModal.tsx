import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { useState, useTransition } from "react";
import { deleteLesson } from "../action";
import { toast } from "sonner";

export function DeleteLessonModal({
  courseId,
  chapterId,
  lessonId,
}: {
  courseId: string;
  chapterId: string;
  lessonId: string;
}) {
  const [IsOpen, setIsOpen] = useState(false);
  const [pending, setTransition] = useTransition();
  function handleOpenChange(open: boolean) {
    setIsOpen(open);
  }

  async function handleDelete() {
    setTransition(async () => {
      try {
        const res = await deleteLesson({ courseId, chapterId, lessonId });
        if (res.status === "error") {
          toast.error(res.message);
        }
        if (res.status === "success") {
          toast.success(res.message);
          setIsOpen(false);
        }
      } catch (error) {
        console.log(error);

        toast.error("Unexpected error occured, please try again later");
      }
    });
  }
  return (
    <AlertDialog open={IsOpen} onOpenChange={handleOpenChange}>
      <AlertDialogTrigger asChild>
        <Button size={"icon"} variant={"outline"}>
          <Trash2 />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            Are you You want to delete lesson?
          </AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete your
            lesson and remove its data from our servers.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <Button
            onClick={handleDelete}
            type="button"
            disabled={pending}
            variant="destructive"
          >
            {pending ? "Deleting" : "Delete"}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
