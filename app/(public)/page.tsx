"use client";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { authClient } from "@/lib/auth-client";
import { Users, ChartColumn, SquareMousePointer, Blocks } from "lucide-react";
import Link from "next/link";
import { ReactNode } from "react";
interface Feature {
  title: string;
  description: string;
  icon: ReactNode;
}
const features: Feature[] = [
  {
    title: "Comprehensive Courses",
    description:
      "Access a wide range of courses across various subjects, designed by industry experts.",
    icon: <Blocks />,
  },
  {
    title: "Interactive Learning",
    description:
      "Engage with interactive content, qizzes, and assignments to enhance your learning experience.",
    icon: <SquareMousePointer />,
  },
  {
    title: "Progress Tracking",
    description:
      "Monitor you progress and achievments with detailed analytics and personalized dashboards.",
    icon: <ChartColumn />,
  },
  {
    title: "Compunity Support",
    description:
      "Join a vibrant community of learners and instructors to collaborate and share knowledge.",
    icon: <Users />,
  },
];

export default function Page() {
  const { data: session, isPending } = authClient.useSession();
  if (isPending) {
    return <p className="text-center">Loading...</p>;
  }
  return (
    <>
      <section className="relative py-20">
        <div className="flex flex-col items-center text-center space-y-8">
          <Badge variant={"outline"}>The Future of Online Education</Badge>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
            Elevate your Learning Experience
          </h1>
          <p className="max-w-[700px] text-muted-foreground md:text-xl">
            Discover a new way to learn with our modern, interactive learning
            managment system. Access high-quality courses anytime, anywhere.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 mt-8">
            <Link
              href="/courses"
              className={buttonVariants({
                size: "lg",
              })}
            >
              Explore Courses
            </Link>
            {!session?.user && (
              <Link
                href="/sign-in"
                className={buttonVariants({
                  size: "lg",
                  variant: "outline",
                })}
              >
                Sign in
              </Link>
            )}
          </div>
        </div>
      </section>
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {features.map((feature, index) => {
          return (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="text-4xl mb-4">{feature.icon}</div>
                <CardTitle>{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{feature.description}</p>
              </CardContent>
            </Card>
          );
        })}
      </section>
    </>
  );
}
