"use client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { authClient } from "@/lib/auth-client";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState, useTransition } from "react";
import { toast } from "sonner";
function SuspenseBoundry({
  otp,
  setOtp,
}: {
  otp: string;
  setOtp: (otp: string) => void;
}) {
  const params = useSearchParams();
  const router = useRouter();
  const [verifyOtpPending, startVerifyOtpTransition] = useTransition();

  const email = params.get("email");
  async function verifyOpt() {
    startVerifyOtpTransition(async () => {
      await authClient.signIn.emailOtp({
        email: email!,
        otp: otp!,
        fetchOptions: {
          onSuccess() {
            toast.success("Email verified successfully");
            router.push("/");
          },
          onError(error) {
            console.log(error);
            toast.error("Invalid OTP, please try again later");
          },
        },
      });
    });
  }
  return (
    <CardContent className="flex flex-col gap-4 items-center justify-center">
      <InputOTP
        maxLength={6}
        className="text-center"
        value={otp}
        onChange={(e) => setOtp(e)}
      >
        <InputOTPGroup>
          <InputOTPSlot index={0} />
          <InputOTPSlot index={1} />
          <InputOTPSlot index={2} />
        </InputOTPGroup>
        <InputOTPSeparator />
        <InputOTPGroup>
          <InputOTPSlot index={3} />
          <InputOTPSlot index={4} />
          <InputOTPSlot index={5} />
        </InputOTPGroup>
      </InputOTP>
      <Button
        disabled={verifyOtpPending}
        className="w-full"
        onClick={verifyOpt}
      >
        Verify Otp
      </Button>
    </CardContent>
  );
}
export default function Page() {
  const [otp, setOtp] = useState("");

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl text-center">Verify OTP</CardTitle>
        <CardDescription>
          please check your email and type 6 digits otp code to continue the
          verification
        </CardDescription>
        <Suspense fallback={"loading"}>
          <SuspenseBoundry otp={otp} setOtp={setOtp} />
        </Suspense>
      </CardHeader>
    </Card>
  );
}
