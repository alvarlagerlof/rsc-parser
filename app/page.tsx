import { Metadata } from "next";
import { Parser } from "./Parser";

export const metadata: Metadata = {
  title: "RSC Parser",
};

export default function Home() {
  return (
    <main className="gap-8 md:gap-12 flex flex-col items-center py-12">
      <div className="flex flex-col gap-1 px-4 max-w-5xl w-full">
        <h1 className="font-medium text-3xl">RSC parser</h1>
        <p>This is a parser attempting to make sense of the RSC wire format.</p>
      </div>
      <Parser />
    </main>
  );
}
