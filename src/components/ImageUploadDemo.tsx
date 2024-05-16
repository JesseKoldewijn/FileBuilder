"use client";

import { useState, type FormEvent } from "react";

const ImageUploadDemo = () => {
  const [fileDetails, setFileDetails] = useState<{
    message: string;
    fileName: string;
  } | null>(null);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const fields = e.currentTarget.elements;
    const imageField = fields.namedItem("image") as HTMLInputElement;
    const image = imageField.files?.item(0);

    if (image) {
      const fileBase64 = await new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onload = () => {
          resolve(reader.result as string);
        };
        reader.readAsDataURL(image);
      });

      const response = await fetch("/api/generate-file", {
        method: "POST",
        body: JSON.stringify({
          file: fileBase64,
        }),
      });

      const data = (await response.json()) as {
        message: string;
        fileName: string;
      };

      setFileDetails(data);
    }
  };

  return (
    <>
      {fileDetails && (
        <div className="mx-auto flex max-w-md flex-col gap-2 pt-24">
          <p>{fileDetails.message}</p>
          <p>{fileDetails.fileName}</p>
        </div>
      )}
      <form
        onSubmit={handleSubmit}
        className="mx-auto flex max-w-md flex-col gap-2 pt-24"
      >
        <input
          name="image"
          id="image"
          type="file"
          accept="image/*"
          className="rounded-md border border-neutral-900 p-2"
        />
        <button
          type="submit"
          className="rounded-md border border-neutral-900 bg-neutral-900 p-2 text-white hover:border-neutral-300 hover:bg-neutral-300"
        >
          Upload
        </button>
      </form>
    </>
  );
};
export default ImageUploadDemo;
