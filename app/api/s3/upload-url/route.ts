import { NextResponse } from "next/server";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { s3Client } from "@/lib/s3";
import z from "zod";
import { v4 as uuidv4 } from "uuid";
import arcjet, { fixedWindow } from "@/lib/arcjet";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

const fileUploadSchema = z.object({
  fileName: z.string().min(1, { message: "please add fileName" }),
  contentType: z.string().min(1, { message: "please add content type" }),
  size: z.number().min(1, { message: "please Add Size" }),
  isImage: z.boolean(),
});
const aj = arcjet.withRule(fixedWindow({ mode: "LIVE", max: 2, window: "1m" }));
export async function POST(req: Request) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    const decision = await aj.protect(req, {
      fingerprint: session?.user.id as string,
    });
    if (decision.isDenied()) {
      return NextResponse.json({ error: "try again later" }, { status: 429 });
    }
    const body = await req.json();
    console.log(body);
    const validation = fileUploadSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: "Invalid Request Body" },
        { status: 400 }
      );
    }
    const { contentType, fileName, size } = validation.data;
    const uniqueKey = `${uuidv4()}-${fileName}`;
    const command = new PutObjectCommand({
      Bucket: process.env.NEXT_PUBLIC_AWS_BUCKET_NAME!,
      Key: uniqueKey, // store in 'uploads' folder
      ContentType: contentType,
      ContentLength: size,
      // ACL: "public-read",
    });

    // URL expires in 10 minutes
    const presignedUrl = await getSignedUrl(s3Client, command, {
      expiresIn: 600,
    });

    return NextResponse.json({ presignedUrl, key: uniqueKey });
  } catch (error) {
    console.error("Error generating signed URL:", error);
    return NextResponse.json(
      { error: "Failed to generate signed URL" },
      { status: 500 }
    );
  }
}
