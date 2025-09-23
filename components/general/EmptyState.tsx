import { Ban } from "lucide-react";
import Link from "next/link";
import { buttonVariants } from "../ui/button";

export default function EmptyState({
  title,
  description,
  buttonText,
  href,
}: {
  buttonText: string;
  title: string;
  description: string;
  href: string;
}) {
  return (
    <div className="flex flex-col flex-1 h-full items-center justify-center rounded-md border-dashed border p-8 text-center animate-in fade-in-50">
      <div className="bg-primary/20 rounded-full flex items-center justify-center size-20 mx-auto">
        <Ban className="size-10 text-primary" />
      </div>
      <h2 className="mt-6 text-lg font-semibold">{title}</h2>
      <p className="mt-2 mb-8 text-center text-sm leading-tight text-muted-foreground">
        {description}
      </p>
      <Link className={buttonVariants()} href={href}>
        {buttonText}
      </Link>
    </div>
  );
}
