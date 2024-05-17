import { customRandom, random } from "nanoid";

import { NextResponse, type NextRequest } from "next/server";
import sharp from "sharp";
import { dedupeCharacters } from "~/lib/image/compressor";

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
  const fileName = customRandom("abcdefghijklmnopqrstuvwxyz", 20, random)();

  const fileBuffer = Buffer.from(file.split(",")[1] ?? "", "base64");

  const compressImage = await sharp(fileBuffer).resize(300).toBuffer();

  const fileBlob = new Blob([compressImage], { type: `image/${ext}` });
  const fileUrl = `${fileName}.${ext}`;

  const file64 = Buffer.from(await fileBlob.arrayBuffer()).toString("base64");

  return NextResponse.json({
    status: 200,
    body: {
      message: "File uploaded successfully",
      fileName: fileUrl,
      fileBinary: dedupeCharacters(file64),
    },
  });
};
