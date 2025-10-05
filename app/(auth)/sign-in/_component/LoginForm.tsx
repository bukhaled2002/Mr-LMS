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
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { authClient } from "@/lib/auth-client";
import { signinSchema, signinSchemaType } from "@/lib/zodSchemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { IconBrandGoogleFilled } from "@tabler/icons-react";
import { GithubIcon, Loader } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
export default function LoginForm() {
  const router = useRouter();
  const [githubPending, startGithubTransition] = useTransition();
  const [googlePending, startGoodleTransition] = useTransition();
  const [signinPending, startSigninTransition] = useTransition();

  const form = useForm<signinSchemaType>({
    resolver: zodResolver(signinSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // 2. Define a submit handler.
  async function onSubmit(values: signinSchemaType) {
    const result = signinSchema.safeParse(values);
    if (result.success === false) {
      toast.error("Invalid input data");
      return;
    }
    signInWithEmail({ email: values.email, password: values.password });
    console.log(values);

    return;
  }
  async function signInWithEmail({
    email,
    password,
  }: {
    email: string;
    password: string;
  }) {
    startSigninTransition(async () => {
      await authClient.signIn.email({
        email,
        password,
        fetchOptions: {
          onSuccess() {
            toast.success("signed in successfully");
            form.reset();
            router.push(`/`);
          },
          onError(error) {
            console.log(error);
            toast.error("cannot sign in, please try again later");
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
            <>
              <IconBrandGoogleFilled className="size-4" />
              sign in with gmail
            </>
          )}
        </Button>
        <div className="relative text-center text-sm after:inset-0 after:absolute after:top-1/2 after:flex after:items-center after:z-0 after:border-t after:border-border">
          <span className="relative bg-card p-2 z-10 text-muted-foreground">
            or continue with
          </span>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="johndoe@gmail.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input placeholder="........." {...field} type="password" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full" disabled={signinPending}>
              {signinPending ? "Signing in..." : "Sign in"}
            </Button>
          </form>
        </Form>
        <p className="text-xs text-muted-foreground text-center">
          {"Don't have an account, "}

          <Link href={"/sign-up"} className="underline hover:text-primary">
            sign up
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}
