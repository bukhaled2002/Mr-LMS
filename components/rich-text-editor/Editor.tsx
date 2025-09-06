/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import TextAlign from "@tiptap/extension-text-align";
import Minubar from "./Minubar";

export default function Editor({ field }: { field: any }) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
    ],
    onUpdate: ({ editor }) => {
      field.onChange(JSON.stringify(editor.getJSON()));
    },
    content: field.value ? JSON.parse(field.value) : "<p>Hello world</p>",
    // Don't render immediately on the server to avoid SSR issues
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class:
          "bg-input/50 min-h-[300px] focus:outline-none border-input border-1 rounded-b-lg prose prose-sm sm:prose lg:prose-lg xl:prose-xl dark:prose-invert !w-full !max-w-none p-2",
      },
    },
  });

  return (
    <div>
      <Minubar editor={editor} />
      <EditorContent editor={editor} />
    </div>
  );
}
