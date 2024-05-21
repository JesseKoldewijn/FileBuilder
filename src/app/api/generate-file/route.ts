import { NextResponse, type NextRequest } from "next/server";
import sharp from "sharp";
import { customRandom, random } from "nanoid";
import { db } from "~/server/db";
import { imageTable } from "~/server/schemas/images";

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

  const alphabet = "abcdefghijklmnopqrstuvwxyz";
  const numbers = "0123456789";
  const allBytes = alphabet + alphabet.toUpperCase() + numbers;
  const fileID = customRandom(allBytes, 10, random)()?.substring(0, 50);

  try {
    const dbInsert = await db.insert(imageTable).values({
      imageID: fileID,
      content: file64,
    });
    const insertedId = dbInsert[0]?.insertId;

    return NextResponse.json({
      status: 200,
      body: {
        message: "File uploaded successfully",
        fileID: insertedId,
        imageID: fileID,
        fileBinary: b64String,
      },
    });
  } catch (error) {
    console.error("Failed to upload file", error);
    return NextResponse.json({
      status: 500,
      body: {
        message: "Failed to upload file",
      },
    });
  }
};
