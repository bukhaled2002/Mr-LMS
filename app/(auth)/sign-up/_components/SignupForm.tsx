"use client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { authClient } from "@/lib/auth-client";
import { signupSchema, signupSchemaType } from "@/lib/zodSchemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import React, { useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import Link from "next/link";
export default function SignupForm() {
  const [emailPending, startEmailTransition] = useTransition();
  const router = useRouter();
  async function signUpWithCredentials({
    email,
    name,
    password,
  }: {
    email: string;
    name: string;
    password: string;
  }) {
    startEmailTransition(async () => {
      await authClient.signUp.email({
        email,
        name,
        password,
        fetchOptions: {
          onSuccess() {
            toast.success("Registered Successfully");

            form.reset();
            router.push("/");
          },
          onError(error) {
            console.log(error);
            toast.error("Error in registering");
          },
        },
      });
    });
  }
  const form = useForm<signupSchemaType>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  // 2. Define a submit handler.
  function onSubmit(values: signupSchemaType) {
    const result = signupSchema.safeParse(values);
    if (result.success === false) {
      toast.error("Invalid input data");
      return;
    }
    console.log(values);
    signUpWithCredentials({
      email: result.data.email,
      name: result.data.name,
      password: result.data.password,
    });
    return;
  }
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">Welcome back!</CardTitle>
        <CardDescription>Login with Github Email account</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
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
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm Password</FormLabel>
                  <FormControl>
                    <Input placeholder="........." {...field} type="password" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full">
              {emailPending ? "Signing up" : "Sign up"}
            </Button>{" "}
            <p className="text-xs text-muted-foreground text-center">
              {"Already has an account? "}

              <Link href={"/sign-in"} className="underline hover:text-primary">
                sign in
              </Link>
            </p>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
