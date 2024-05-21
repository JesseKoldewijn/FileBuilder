import { NextResponse, type NextRequest } from "next/server";
import sharp from "sharp";

export const POST = async (req: NextRequest) => {
  const body = (await req.json()) as {
    file: string;
  };

  if (!body.file) {
    return NextResponse.json({
      status: 400,
      body: {
        message: "No file provided",
      },
    });
  }

  const file = body.file;
  const ext = file.split(";")[0]?.split("/")[1];

  const fileBuffer = Buffer.from(file.split(",")[1] ?? "", "base64");
  const compressImage = await sharp(fileBuffer)
    .resize(100)
    .blur(0.8)
    .toBuffer();
  const fileBlob = new Blob([compressImage], { type: `image/${ext}` });

  const file64 = Buffer.from(await fileBlob.arrayBuffer()).toString("base64");
  const b64String = `data:image/${ext};base64,${file64}`;

  // Instead of sending over b64 string, you can save the string to a database
  // or redis cache, and send an ID to the client to retrieve the file later.

  return NextResponse.json({
    status: 200,
    body: {
      message: "File uploaded successfully",
      fileBinary: b64String,
    },
  });
};
