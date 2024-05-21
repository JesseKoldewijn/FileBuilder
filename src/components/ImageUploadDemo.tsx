"use client";

import { useState } from "react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Label } from "./ui/label";
import Image from "next/image";
import Link from "next/link";

/* eslint-disable @typescript-eslint/ban-ts-comment */

const formSchema = z.object({
  file: z.any().optional(),
});

const ImageUploadDemo = () => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  const fileRef = form.register("file");

  const [fileDetails, setFileDetails] = useState<{
    message: string;
    fileBinary: string;
  } | null>(null);

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    const list = data.file as FileList;
    const image = list?.item(0);

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

      if (!response.ok) {
        console.error("Failed to upload file");
        return;
      }

      const data = (await response.json()) as {
        body: {
          message: string;
          fileBinary: string;
        };
      };

      const body = data?.body;

      if (body) {
        // const publicPath = `http://localhost:3000/api/get-file?filename=${fP}`;
        const details: typeof fileDetails = {
          message: body.message,
          fileBinary: body.fileBinary,
        };
        setFileDetails(details);
      }
    }
  };

  return (
    <div className="mx-0 flex w-screen max-w-md flex-col items-center justify-center gap-4 px-4 md:px-0">
      {fileDetails && (
        <div className="flex w-full max-w-md flex-col gap-2">
          <p>{fileDetails.message}</p>
          <Image
            src={fileDetails.fileBinary}
            alt="Image which was send previously"
            height={200}
            width={200}
          />
        </div>
      )}
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex w-full max-w-sm flex-col gap-2"
        >
          <FormField
            control={form.control}
            name="file"
            render={({ field }) => {
              return (
                <FormItem>
                  <FormLabel className="capitalize">{field.name}</FormLabel>
                  <FormControl>
                    <div className="flex flex-col gap-2 pb-2">
                      {field.name === "file" ? (
                        <>
                          <ImagePreviewSection field={field} />
                          <Button variant="outline" asChild>
                            <Label htmlFor="file">Choose a file</Label>
                          </Button>
                          <Input
                            id="file"
                            type="file"
                            className="hidden"
                            max={1}
                            accept="image/*"
                            {...fileRef}
                          />
                        </>
                      ) : (
                        <Input {...field} />
                      )}
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              );
            }}
          />
          <Button type="submit">Upload</Button>
        </form>
      </Form>
    </div>
  );
};
export default ImageUploadDemo;

function ImagePreviewSection({
  field,
}: {
  field: {
    value: FileList | null;
  };
}) {
  const file = field.value?.item(0);

  if (!file) return;

  return (
    <div className="flex flex-col items-center gap-2 pb-2">
      <ImagePreview file={file} />
      <p>{file.name}</p>
    </div>
  );
}

function ImagePreview({ file }: { file: File }) {
  return (
    <Image
      src={URL.createObjectURL(file)}
      height={200}
      width={200}
      alt="preview"
      className="aspect-square max-h-96 max-w-full object-cover"
    />
  );
}
