import {
  AlignCenter,
  AlignLeft,
  AlignRight,
  BoldIcon,
  Heading1,
  Heading2,
  Heading3,
  ItalicIcon,
  ListIcon,
  ListOrdered,
  Redo,
  StrikethroughIcon,
  Undo,
} from "lucide-react";
import { type Editor } from "@tiptap/react";
import EditorToggleButton from "./EditorToggleButton";

export default function Minubar({ editor }: { editor: Editor | null }) {
  if (!editor) return null;
  return (
    <div className="border border-input border-b-[0px] rounded-t-lg bg-card p-2 flex flex-wrap gap-1 items-center">
      {/* Bold Button */}
      <EditorToggleButton
        editor={editor}
        tooltip="Bold"
        isActive={editor.isActive("bold")}
        command={() => editor.chain().focus().toggleBold().run()}
        icon={<BoldIcon className="h-4 w-4" />}
      />

      {/* Italic Button */}
      <EditorToggleButton
        editor={editor}
        tooltip="Italic"
        isActive={editor.isActive("italic")}
        command={() => editor.chain().focus().toggleItalic().run()}
        icon={<ItalicIcon className="h-4 w-4" />}
      />

      {/* Strike Button */}
      <EditorToggleButton
        editor={editor}
        tooltip="Strike"
        isActive={editor.isActive("strike")}
        command={() => editor.chain().focus().toggleStrike().run()}
        icon={<StrikethroughIcon className="h-4 w-4" />}
      />

      {/* h1 Button */}
      <EditorToggleButton
        editor={editor}
        tooltip="Heading 1"
        isActive={editor.isActive("heading", { level: 1 })}
        command={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        icon={<Heading1 className="h-4 w-4" />}
      />

      {/* h2 Button */}
      <EditorToggleButton
        editor={editor}
        tooltip="Heading 2"
        isActive={editor.isActive("heading", { level: 2 })}
        command={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        icon={<Heading2 className="h-4 w-4" />}
      />

      {/* h3 Button */}
      <EditorToggleButton
        editor={editor}
        tooltip="Heading 3"
        isActive={editor.isActive("heading", { level: 3 })}
        command={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        icon={<Heading3 className="h-4 w-4" />}
      />

      {/* BulletList button */}
      <EditorToggleButton
        editor={editor}
        tooltip="Bullet List"
        isActive={editor.isActive("bulletList")}
        command={() => editor.chain().focus().toggleBulletList().run()}
        icon={<ListIcon className="h-4 w-4" />}
      />

      {/* OrderedList button */}
      <EditorToggleButton
        editor={editor}
        tooltip="Ordered List"
        isActive={editor.isActive("orderedList")}
        command={() => editor.chain().focus().toggleOrderedList().run()}
        icon={<ListOrdered className="h-4 w-4" />}
      />
      <div className="w-px h-6 bg-border mx-2" />
      <div className="flex flex-wrap gap-1">
        {/* ALign left button */}
        <EditorToggleButton
          editor={editor}
          tooltip="Align Left"
          isActive={editor.isActive({ textAlign: "left" })}
          command={() => editor.chain().focus().setTextAlign("left").run()}
          icon={<AlignLeft className="h-4 w-4" />}
        />

        {/* ALign center button */}
        <EditorToggleButton
          editor={editor}
          tooltip="Align Center"
          isActive={editor.isActive({ textAlign: "center" })}
          command={() => editor.chain().focus().setTextAlign("center").run()}
          icon={<AlignCenter className="h-4 w-4" />}
        />

        {/* ALign righe button */}
        <EditorToggleButton
          editor={editor}
          tooltip="Align Right"
          isActive={editor.isActive({ textAlign: "right" })}
          command={() => editor.chain().focus().setTextAlign("right").run()}
          icon={<AlignRight className="h-4 w-4" />}
        />
      </div>
      <div className="w-px h-6 bg-border mx-2" />
      <EditorToggleButton
        editor={editor}
        tooltip="Undo"
        type={"undo"}
        disableAction={!editor.can().undo()}
        command={() => editor.chain().focus().undo().run()}
        icon={<Undo className="h-4 w-4" />}
      />
      <EditorToggleButton
        editor={editor}
        tooltip="Redo"
        type={"redo"}
        disableAction={!editor.can().redo()}
        command={() => editor.chain().focus().redo().run()}
        icon={<Redo className="h-4 w-4" />}
      />
    </div>
  );
}
