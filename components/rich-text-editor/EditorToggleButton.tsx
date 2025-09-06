"use client";

import { type Editor } from "@tiptap/react";
import { Toggle } from "../ui/toggle";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";
import { cn } from "@/lib/utils";
import { Button } from "../ui/button";
import { Undo } from "lucide-react";

interface EditorToggleButtonProps {
  editor: Editor | null;
  command: () => void; // TipTap command function
  isActive?: boolean; // whether the editor state is active for this format
  tooltip: string; // tooltip text
  icon: React.ReactNode; // icon component
  className?: string; // optional custom class
  type?: "undo" | "redo" | "default";
  disableAction?: boolean;
}

export default function EditorToggleButton({
  editor,
  command,
  isActive,
  tooltip,
  icon,
  className,
  disableAction = false,
  type = "default",
}: EditorToggleButtonProps) {
  if (!editor) return null;
  console.log(disableAction);
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        {type === "undo" ? (
          <Button
            size="sm"
            variant="ghost"
            type="button"
            onClick={command}
            disabled={disableAction}
          >
            {icon}
          </Button>
        ) : type === "redo" ? (
          <Button
            size="sm"
            variant="ghost"
            type="button"
            onClick={command}
            disabled={disableAction}
          >
            {icon}
          </Button>
        ) : (
          <Toggle
            size="sm"
            pressed={isActive}
            onPressedChange={command}
            className={cn(
              "transition-colors",
              isActive
                ? "hover:bg-accent/20 bg-accent/40 text-muted-foreground"
                : "hover:bg-accent/10 text-foreground",
              className
            )}
          >
            {icon}
          </Toggle>
        )}
      </TooltipTrigger>
      <TooltipContent>{tooltip}</TooltipContent>
    </Tooltip>
  );
}
