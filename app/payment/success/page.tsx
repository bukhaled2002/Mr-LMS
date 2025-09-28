"use client";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import useConfetti from "@/hooks/use-confetti";
import { ArrowLeft, CheckIcon } from "lucide-react";
import Link from "next/link";
import { useEffect } from "react";

export default function Page() {
  const { triggerConfetti } = useConfetti();
  useEffect(() => {
    triggerConfetti();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <div className="w-full min-h-screen flex flex-1 justify-center items-center">
      <Card className="w-[350px]">
        <CardContent>
          <div className="w-full flex justify-center">
            <CheckIcon className="size-12 p-2 bg-green-500/30 text-green-500 rounded-full" />
          </div>
          <div className="w-full text-center mt-3 ">
            <h2 className="text-xl font-semibold"> Payment Success</h2>
            <p className="text-balance text-muted-foreground text-sm mt-2">
              {
                "Congrats your payment was successfull, you are now enrolled in the course"
              }
            </p>
            <Link
              href={"/dashboard"}
              className={buttonVariants({ className: "w-full mt-3" })}
            >
              <ArrowLeft className="size-4" />
              <span>Go to dashboard</span>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
