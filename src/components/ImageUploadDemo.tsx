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
    fileName: string;
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

      const data = (await response.json()) as {
        message: string;
        fileName: string;
      };

      setFileDetails(data);
    }
  };

  return (
    <div className="px-4 md:px-0">
      {fileDetails && (
        <div className="mx-auto flex max-w-md flex-col gap-2 pt-24">
          <p>{fileDetails.message}</p>
          <p>{fileDetails.fileName}</p>
        </div>
      )}
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="mx-auto flex max-w-md flex-col gap-2 pt-24"
        >
          <FormField
            control={form.control}
            name="file"
            render={({ field }) => {
              return (
                <FormItem>
                  <FormLabel>File</FormLabel>
                  <FormControl>
                    <Input type="file" placeholder="shadcn" {...fileRef} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              );
            }}
          />
          <Button
            type="submit"
            className="rounded-md border border-neutral-900 bg-neutral-900 p-2 text-white hover:border-neutral-300 hover:bg-neutral-300"
          >
            Upload
          </Button>
        </form>
      </Form>
    </div>
  );
};
export default ImageUploadDemo;
