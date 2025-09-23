"use client";
import { useCallback, useEffect, useState } from "react";
import { FileRejection, useDropzone } from "react-dropzone";
import { Card, CardContent } from "../ui/card";
import { cn } from "@/lib/utils";
import {
  RenderEmptyState,
  RenderErrorState,
  RenderUploadedState,
  RenderUploadingState,
} from "./RenderState";
import { toast } from "sonner";
import { v4 as uuidv4 } from "uuid";
import useConstructUrl from "@/hooks/useConstructUrl";

interface UploaderState {
  id: string | null;
  file: File | null;
  uploading: boolean;
  progress: number;
  key?: string;
  isDeleting: boolean;
  error: boolean;
  objectUrl?: string;
  fileType: "image" | "video";
}

export default function Uploader({
  value,
  onChange,
  fileType,
}: {
  value: string;
  onChange?: (value: string) => void;
  fileType: "image" | "video";
}) {
  console.log(value);
  const fileUrl = useConstructUrl(value as string);
  const [fileState, setFileState] = useState<UploaderState>({
    error: false,
    file: null,
    id: null,
    isDeleting: false,
    key: value,
    progress: 0,
    uploading: false,
    fileType: fileType,
    objectUrl: value === "" ? undefined : fileUrl,
  });

  const uploadFile = useCallback(
    async (file: File) => {
      setFileState((prev) => ({
        ...prev,
        uploading: true,
        progress: 0,
      }));

      try {
        if (!file) return alert("Please select a file");

        // 1. Get signed URL from API
        const presignedResponse = await fetch("/api/s3/upload-url", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            fileName: file.name,
            contentType: file.type,
            size: file.size,
            isImage: fileType === "image" ? true : false,
          }),
        });

        if (!presignedResponse.ok) {
          toast.error("Something went wrong, please try again later");
          setFileState((prev) => ({
            ...prev,
            error: true,
            progress: 0,
            objectUrl: undefined,
            uploading: false,
          }));
          return;
        }
        const res = await presignedResponse.json();
        const { presignedUrl, key } = res;
        console.log(presignedUrl);
        await new Promise<void>((resolve, reject) => {
          const xhr = new XMLHttpRequest();
          console.log(xhr);
          xhr.upload.onprogress = (event) => {
            if (event.lengthComputable) {
              const percentageComplete = Math.round(
                (event.loaded / event.total) * 100
              );
              setFileState((prev) => ({
                ...prev,
                progress: percentageComplete,
              }));
            }
          };
          xhr.onload = () => {
            console.log(xhr.status);
            if (xhr.status === 200 || xhr.status === 204) {
              setFileState((prev) => ({
                ...prev,
                progress: 100,
                uploading: false,
                key: key,
              }));
              console.log(key);
              onChange?.(key);
              toast.success("File uploaded Successfully");
              resolve();
            } else {
              reject(new Error("Upload failed..."));
            }
          };
          xhr.onerror = () => {
            reject(new Error("upload failed"));
          };
          xhr.open("PUT", presignedUrl);
          console.log(file.type);
          xhr.setRequestHeader("Content-Type", file.type);
          xhr.send(file);
        });
      } catch (error) {
        console.log(error);
        toast.error("something went wrong");
        setFileState((prev) => ({
          ...prev,
          error: true,
          progress: 0,
          objectUrl: undefined,
          uploading: false,
        }));
      }
    },
    [onChange, fileType]
  );
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles.length > 0) {
        const file = acceptedFiles[0];
        if (fileState.objectUrl && !fileState.objectUrl.startsWith("http")) {
          URL.revokeObjectURL(fileState.objectUrl);
        }
        setFileState({
          file,
          uploading: false,
          progress: 0,
          objectUrl: URL.createObjectURL(file),
          error: false,
          id: uuidv4(),
          isDeleting: false,
          fileType: fileType,
        });
        uploadFile(file);
      }
    },
    [fileState.objectUrl, fileType, uploadFile]
  );

  const handleRemoveFile = async () => {
    if (fileState.isDeleting || !fileState.objectUrl) return;
    try {
      console.log("object");
      setFileState((prev) => ({ ...prev, isDeleting: true }));
      console.log("deleting");
      const response = await fetch("/api/s3/delete", {
        method: "DELETE",
        body: JSON.stringify({ key: fileState.key }),
        headers: { "Content-Type": "application/json" },
      });

      if (!response.ok) {
        toast.error("failed to remove file from the storage");
        setFileState((prev) => ({ ...prev, isDeleting: true, error: true }));
        return;
      }
      if (fileState.objectUrl && !fileState.objectUrl.startsWith("http")) {
        URL.revokeObjectURL(fileState.objectUrl);
      }
      onChange?.("");

      setFileState((prev) => ({
        ...prev,
        file: null,
        progress: 0,
        uploading: false,
        objectUrl: undefined,
        isDeleting: true,
        error: false,
      }));
      toast.success("File removed successfully");
    } catch (error) {
      console.log(error);
      toast.error("failed to remove file from the storage");
      setFileState((prev) => ({
        ...prev,
        isDeleting: false,
        error: true,
      }));
    }
  };

  function rejectedFiles(fileRejection: FileRejection[]) {
    if (fileRejection.length) {
      const tooManyFiles = fileRejection.find(
        (file) => file.errors[0].code === "too-many-files"
      );
      const fileSizetooBig = fileRejection.find(
        (file) => file.errors[0].code === "file-too-large"
      );
      if (tooManyFiles) {
        toast.error("too many files selected, max 1");
      }
      if (fileSizetooBig) {
        toast.error("File Size exceeds the limit '5mb' ");
      }
    }
  }
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: fileType === "image" ? { "image/*": [] } : { "video/*": [] },
    maxFiles: 1,
    multiple: false,
    maxSize: fileType === "image" ? 5 * 1024 * 1024 : 500 * 1024 * 1024,
    onDropRejected: rejectedFiles,
    disabled: fileState.uploading || !!fileState.objectUrl,
  });

  const renderContent = () => {
    if (fileState.uploading) {
      return (
        <RenderUploadingState
          file={fileState.file!}
          progress={fileState.progress}
        />
      );
    }
    if (fileState.error) {
      return <RenderErrorState />;
    }
    if (fileState.objectUrl) {
      return (
        <RenderUploadedState
          isDeleting={fileState.isDeleting}
          handleRemoveFile={handleRemoveFile}
          previewURL={fileState.objectUrl}
          fileType={fileState.fileType}
        />
      );
    }
    return <RenderEmptyState isDragActive={isDragActive} />;
  };

  useEffect(() => {
    return () => {
      if (fileState.objectUrl && !fileState.objectUrl.startsWith("http")) {
        URL.revokeObjectURL(fileState.objectUrl);
      }
    };
  }, [fileState.objectUrl]);

  return (
    <Card
      {...getRootProps()}
      className={cn(
        "relative border-2 transition border-dashed ease-in-out w-full duration-200 h-64",
        isDragActive
          ? "border-primary bg-primary/10 border-solid"
          : "border-border hover:border-primary"
      )}
    >
      <CardContent className="flex items-center justify-center h-full w-full p-4">
        <input {...getInputProps()} />
        {renderContent()}
      </CardContent>
    </Card>
  );
}
