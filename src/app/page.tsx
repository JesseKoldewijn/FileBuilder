import ImageUploadDemo from "~/components/ImageUploadDemo";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4">
      <h1 className="text-center font-mono text-4xl font-bold">Image Upload</h1>
      <ImageUploadDemo />
    </div>
  );
}
