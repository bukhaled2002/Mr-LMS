import z from "zod";

export const CourseLevel = ["Beginner", "Intermediate", "Advanced"] as const;
export const courseCategories = [
  "Development",
  "Business",
  "Finance",
  "IT & Software",
  "Office Productivity",
  "Personal Development",
  "Design",
  "Marketing",
  "Health & Fitness",
  "Music",
  "Teaching & Academics",
] as const;
export const CourseStatus = ["Draft", "Published", "Archived"] as const;

export const courseSchema = z.object({
  title: z
    .string()
    .min(3, "title is required")
    .max(100, "title must be less than 100 characters"),
  description: z
    .string()
    .min(1, "description is required")
    .max(1000, "description must be less than 1000 characters"),
  fileKey: z.string().min(1, "file key is required"), // Changed from min(0) to min(1)
  price: z.coerce
    .number()
    .min(0, { message: "price cannot be negative" }) // Allow 0 for free courses
    .default(0),
  duration: z.coerce
    .number()
    .min(1, { message: "duration must be at least 1" })
    .default(1), // Changed default to 1 to match minimum
  level: z.enum(CourseLevel, { message: "level is required" }),
  category: z.enum(courseCategories, { message: "category is required" }),
  smallDescription: z
    .string()
    .min(1, "small description is required")
    .max(200, "small description must be less than 200 characters"),
  slug: z
    .string()
    .min(1, "slug is required")
    .max(100, "slug must be less than 100 characters"),
  status: z.enum(CourseStatus, { message: "status is required" }),
});

export const chapterSchema = z.object({
  name: z.string().min(1, "Name is required"),
  courseId: z.string().uuid("Invalid course id"),
});
export const lessonSchema = z.object({
  name: z.string().min(1, "Name is required"),
  chapterId: z.string().uuid("Invalid chapter id"),
  courseId: z.string().uuid("Invalid chapter id"),
  videoUrlKey: z.string().optional(),
  thubnailUrlKey: z.string().optional(),
  description: z.string().optional(),
});

export type courseSchemaType = z.input<typeof courseSchema>;
export type chapterSchemaType = z.input<typeof chapterSchema>;
export type lessonSchemaType = z.input<typeof lessonSchema>;
