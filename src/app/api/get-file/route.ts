import { readFile } from "fs/promises";
import { NextResponse, type NextRequest } from "next/server";
import path from "path";
export const GET = async (req: NextRequest) => {
  const searchParams = new URL(req.url).searchParams;

  const fileName = searchParams.get("filename");

  if (!fileName) {
    return NextResponse.json({
      status: 400,
      body: {
        message: "No file provided",
      },
    });
  }

  try {
    const uploadPath = "public/uploads";
    const fsDir = path.join(process.cwd(), uploadPath);

    const file = await readFile(path.join(fsDir, fileName));
    const imageBuffer = Buffer.from(file);
    const fileExt = fileName.split(".").pop();
    const mimeType = `image/${fileExt}`;

    const imageFileReadableStream = new ReadableStream({
      start(controller) {
        controller.enqueue(imageBuffer);
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
