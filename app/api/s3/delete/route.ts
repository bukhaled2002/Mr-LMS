import arcjet, { detectBot, fixedWindow } from "@/lib/arcjet";
import { auth } from "@/lib/auth";
import { s3Client } from "@/lib/s3";
import { DeleteObjectCommand } from "@aws-sdk/client-s3";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
const aj = arcjet.withRule(fixedWindow({ mode: "LIVE", max: 6, window: "1m" }));
export async function DELETE(req: Request) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    const decision = await aj.protect(req, {
      fingerprint: session?.user.id as string,
    });
    if (decision.isDenied()) {
      return NextResponse.json(
        { error: "Please try again later" },
        { status: 429 }
      );
    }
    const body = await req.json();
    const key = body.key;
    console.log(key);
    if (!key) {
      return NextResponse.json(
        { error: "Missing or invalid object key" },
        { status: 400 }
      );
    }
    const command = new DeleteObjectCommand({
      Bucket: process.env.NEXT_PUBLIC_AWS_BUCKET_NAME,
      Key: key,
    });
    await s3Client.send(command);
    return NextResponse.json(
      { message: "file deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: "Missin or invalid key" },
      { status: 400 }
    );
  }
}
