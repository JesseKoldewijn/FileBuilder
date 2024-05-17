import { customRandom, random } from "nanoid";

import path from "path";
import { access, mkdir, unlink, writeFile } from "fs/promises";
import { NextResponse, type NextRequest } from "next/server";
import { env } from "~/env";

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

  const fileBlob = new Blob([fileBuffer], { type: `image/${ext}` });

  const isProd = env.NODE_ENV === "production";
  const uploadPath = isProd ? "uploads" : "public/uploads";
  const fsDir = path.join(process.cwd(), uploadPath);
  const filePath = path.join(fsDir, fileName);

  const uploadDirExists = await access(fsDir)
    .then(() => true)
    .catch(() => false);

  if (!uploadDirExists) {
    await mkdir(fsDir);
  }

  const filePathWithExt = `${filePath}.${ext}`;
  await writeFile(filePathWithExt, Buffer.from(await fileBlob.arrayBuffer()));

  const fileUrl = `/uploads/${fileName}.${ext}`;

  // passive timeout to delete the file after 1 hour (cleanup)
  setTimeout(() => {
    unlink(filePathWithExt).catch((x) => console.error(x));
  }, 3600000);

  return NextResponse.json({
    status: 200,
    body: {
      message: "File uploaded successfully",
      fileName: fileUrl,
    },
  });
};
