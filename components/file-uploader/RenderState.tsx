import { cn } from "@/lib/utils";
import { CloudUploadIcon, ImageIcon, Loader2, XIcon } from "lucide-react";
import { Button } from "../ui/button";
import Image from "next/image";

export function RenderEmptyState({ isDragActive }: { isDragActive: boolean }) {
  return (
    <div className="text-center">
      <div className="size-12 bg-black/30 mx-auto flex items-center justify-center mb-4 rounded-full">
        <CloudUploadIcon
          className={cn(
            "size-6 text-muted-foreground",
            isDragActive && "text-primary"
          )}
        />
      </div>
      <p className="text-base font-semibold text-foreground">
        Drop your files here or{" "}
        <span className="text-primary font-bold cursor-pointer ml-1">
          click to upload
        </span>
      </p>
      <Button className="mt-4" type="button">
        Select File
      </Button>
    </div>
  );
}

export function RenderErrorState() {
  return (
    <div className="text-center">
      <div className="size-12 mx-auto flex items-center justify-center mb-4 rounded-full bg-destructive/30">
        <ImageIcon className={cn("size-6 text-destructive")} />
      </div>
      <p className="text-base font-semibold text-foreground">Upload Failed</p>
      <p className="text-xs text-muted-foreground mt-1">something went wrong</p>
      <Button className="mt-4" type="button">
        Retry
      </Button>
    </div>
  );
}

export function RenderUploadedState({
  previewURL,
  isDeleting,
  handleRemoveFile,
  fileType,
}: {
  previewURL: string;
  isDeleting: boolean;
  handleRemoveFile: () => void;
  fileType: "image" | "video";
}) {
  return (
    <div className="relative group w-full h-full flex items-center justify-center">
      {fileType === "image" ? (
        <Image
          src={previewURL}
          alt="Uploaded File"
          fill
          className="object-contain p-2"
        />
      ) : (
        <video
          src={previewURL}
          controls
          className="object-contain rounded-md p-2 h-full w-full absolute top-0 left-0"
        />
      )}
      <Button
        onClick={handleRemoveFile}
        disabled={isDeleting}
        type="button"
        variant={"destructive"}
        size={"icon"}
        className={cn("absolute top-4 right-4 cursor-pointer")}
      >
        {isDeleting ? <Loader2 className="size-4 animate-spin" /> : <XIcon />}
      </Button>
    </div>
  );
}

export function RenderUploadingState({
  file,
  progress,
}: {
  progress: number;
  file: File;
}) {
  return (
    <div className="text-center flex justify-center items-center flex-col">
      <p> {progress}</p>
      <p className="mt-2 text-sm font-medium text-muted-foreground">
        Uploading...
      </p>
      <p className="mt-2 text-xs font-medium text-muted-foreground truncate max-w-xs">
        {file.name}
      </p>
    </div>
  );
}
