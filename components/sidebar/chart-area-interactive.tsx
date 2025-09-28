"use client";

import * as React from "react";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

export const description = "An interactive area chart";

export function ChartAreaInteractive({
  data,
}: {
  data: {
    date: string;
    enrollment: number;
  }[];
}) {
  const total = data.reduce((acc, curr) => acc + curr.enrollment, 0);
  return (
    <Card className="@container/card">
      <CardHeader>
        <CardTitle>Total Enrollments</CardTitle>
        <CardDescription>
          <span className="hidden @[540px]/card:block">
            Total Enrollments for the last 30 days
          </span>
          <span className="hidden @[540px]/card:block">
            Last: 30 days: {total}{" "}
          </span>
        </CardDescription>
        <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
          <ChartContainer
            className="aspect-auto h-[250px]"
            config={
              {
                enrollments: { label: "Enrollments", color: "var(--chart-1)" },
              } satisfies ChartConfig
            }
          >
            <BarChart margin={{ left: 12, right: 12 }} data={data}>
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey={"date"}
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                interval={"preserveStartEnd"}
                tickFormatter={(val) => {
                  const date = new Date(val);
                  return date.toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                  });
                }}
              />
              <ChartTooltip
                content={
                  <ChartTooltipContent
                    className="w-[150px]"
                    labelFormatter={(val) => {
                      const date = new Date(val);
                      return date.toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      });
                    }}
                  />
                }
              />
              <Bar dataKey={"enrollment"} fill="var(--color-enrollments)" />
            </BarChart>
          </ChartContainer>
        </CardContent>
      </CardHeader>
    </Card>
  );
}
