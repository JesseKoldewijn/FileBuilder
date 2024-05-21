import { eq } from "drizzle-orm";
import { NextResponse, type NextRequest } from "next/server";
import { db } from "~/server/db";
import { imageTable } from "~/server/schemas/images";

export const GET = async (req: NextRequest) => {
  const searchParams = new URL(req.url).searchParams;

  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json({
      status: 400,
      body: {
        message: "No ID provided",
      },
    });
  }

  try {
    // base64 image string or null
    const file = (
      await db
        .select()
        .from(imageTable)
        .where(eq(imageTable.imageID, id))
        .limit(1)
    )?.at(0);

    if (!file) {
      return NextResponse.json({
        status: 404,
        body: {
          message: "File not found",
        },
      });
    }

    const fileBuffer = Buffer.from(file.content, "base64");
    const fileExt = file.content.split(";")[0]?.split("/")[1];
    const mimeType = `image/${fileExt}`;

    const imageFileReadableStream = new ReadableStream({
      start(controller) {
        controller.enqueue(fileBuffer);
        controller.close();
      },
    });

    const imageResponse = new Response(imageFileReadableStream, {
      headers: {
        "Content-Type": mimeType,
      },
    });

    return imageResponse;
  } catch (error) {
    return NextResponse.json({
      status: 404,
      body: {
        message: "File not found",
      },
    });
  }
};
