"use client";
import TextAlign from "@tiptap/extension-text-align";
import { generateHTML } from "@tiptap/html";
import { type JSONContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { useMemo } from "react";
import parser from "html-react-parser";

export default function PreviewRichText({ json }: { json: JSONContent }) {
  const output = useMemo(() => {
    return generateHTML(json, [
      StarterKit,
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
    ]);
  }, [json]);
  return (
    <div className="prose dark:prose-invert prose-li:marker:text-primary">
      {parser(output)}
    </div>
  );
}
