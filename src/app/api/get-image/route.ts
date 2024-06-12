import { eq } from "drizzle-orm";
import { NextResponse, type NextRequest } from "next/server";
import sharp from "sharp";
import { db } from "~/server/db";
import { imageTable } from "~/server/schemas/images";

export const GET = async (req: NextRequest) => {
  const searchParams = new URL(req.url).searchParams;

  const id = searchParams.get("id");

  const widthString = searchParams.get("width") ?? "100";
  const heightString = searchParams.get("height") ?? "100";

  const widthInt = !isNaN(parseInt(widthString)) ? parseInt(widthString) : 100;
  const heightInt = !isNaN(parseInt(heightString))
    ? parseInt(heightString)
    : 100;

  const compress =
    !!searchParams.get("compress") || widthInt > 100 || heightInt > 100;

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

    const ext = file.content.split(";")[0]?.split("/")[1];

    const fileBuffer = Buffer.from(file.content.split(",")[1] ?? "", "base64");
    const compressImage = compress
      ? await sharp(fileBuffer).resize(widthInt, heightInt).toBuffer()
      : fileBuffer;

    const mimeType = `image/${ext}`;

    const imageFileReadableStream = new ReadableStream({
      start(controller) {
        controller.enqueue(compressImage);
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
