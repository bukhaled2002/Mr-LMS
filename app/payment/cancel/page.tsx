import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, XIcon } from "lucide-react";
import Link from "next/link";

function page() {
  return (
    <div className="w-full min-h-screen flex flex-1 justify-center items-center">
      <Card className="w-[350px]">
        <CardContent>
          <div className="w-full flex justify-center">
            <XIcon className="size-12 p-2 bg-destructive/30 text-destructive rounded-full" />
          </div>
          <div className="w-full text-center mt-3 ">
            <h2 className="text-xl font-semibold"> Payment Cancelled</h2>
            <p className="text-balance text-muted-foreground text-sm mt-2">
              {"You cancelled your payment, Don't worry you won't be charged"}
            </p>
            <Link
              href={"/dashboard"}
              className={buttonVariants({ className: "w-full mt-3" })}
            >
              <ArrowLeft className="size-4" />
              <span>Go back to Home page</span>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default page;
