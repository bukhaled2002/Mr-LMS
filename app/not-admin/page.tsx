import { buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ArrowLeft, ShieldX } from "lucide-react";
import Link from "next/link";

export default function Page() {
  return (
    <div className="h-screen flex flex-col items-center justify-center ">
      <Card className="max-w-md w-full">
        <CardHeader className="text-center">
          <div className="bg-destructive/30 p-4 rounded-full w-fit mx-auto">
            <ShieldX className="size-16 text-destructive" />
          </div>
          <CardTitle className="text-destructive">Access Restricted</CardTitle>
          <CardDescription className="text-muted-foreground">
            {"You are not admin, so you can't create a course"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Link href={"/"} className={buttonVariants({ className: "w-full" })}>
            <ArrowLeft /> Back to home
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
