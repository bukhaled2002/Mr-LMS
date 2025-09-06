"use client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { authClient } from "@/lib/auth-client";
import { GithubIcon, Loader } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { toast } from "sonner";
export default function LoginForm() {
  const [email, setEmail] = useState("");
  const router = useRouter();
  const [githubPending, startGithubTransition] = useTransition();
  const [googlePending, startGoodleTransition] = useTransition();
  const [emailPending, startEmailTransition] = useTransition();

  async function signUpWithEmail() {
    startEmailTransition(async () => {
      await authClient.emailOtp.sendVerificationOtp({
        email,
        type: "sign-in",
        fetchOptions: {
          onSuccess() {
            toast.success("OTP sent to your email successfully");
            router.push(`/verify-email?email=${email}`);
          },
          onError(error) {
            console.log(error);
            toast.error("Error in sending otp, please try again later");
          },
        },
      });
    });
  }

  async function signUpWithGithub() {
    startGithubTransition(async () => {
      await authClient.signIn.social({
        provider: "github",
        callbackURL: "/",
        fetchOptions: {
          onSuccess() {
            toast.success("Successfully signed in");
          },
          onError(error) {
            console.log(error);
            toast.success("Internal server error, please try again later");
          },
        },
      });
    });
  }
  async function signUpWithGoogle() {
    startGoodleTransition(async () => {
      await authClient.signIn.social({
        provider: "google",
        callbackURL: "/",
        fetchOptions: {
          onSuccess() {
            toast.success("Successfully signed in");
          },
          onError(error) {
            console.log(error);
            toast.success("Internal server error, please try again later");
          },
        },
      });
    });
  }
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">Welcome back!</CardTitle>
        <CardDescription>Login with Github Email account</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <Button
          disabled={githubPending}
          className="w-full"
          variant={"outline"}
          onClick={signUpWithGithub}
        >
          {githubPending ? (
            <>
              <Loader className="size-4 animate-spin" /> Loading
            </>
          ) : (
            <>
              <GithubIcon className="size-4" /> sign in with github
            </>
          )}
        </Button>
        <Button
          disabled={googlePending}
          className="w-full"
          variant={"outline"}
          onClick={signUpWithGoogle}
        >
          {googlePending ? (
            <>
              <Loader className="size-4 animate-spin" /> Loading
            </>
          ) : (
            <>sign in with gmail</>
          )}
        </Button>
        <div className="relative text-center text-sm after:inset-0 after:absolute after:top-1/2 after:flex after:items-center after:z-0 after:border-t after:border-border">
          <span className="relative bg-card p-2 z-10 text-muted-foreground">
            or continue with
          </span>
        </div>
        <div className="grid gap-3">
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              placeholder="johndoe@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <Button disabled={emailPending} onClick={signUpWithEmail}>
            Continue with Email
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
