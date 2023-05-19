import { Metadata } from "next";
import { Parser } from "./Parser";
import Link from "next/link";

export const metadata: Metadata = {
  title: "RSC Parser",
};

export default function Home() {
  return (
    <main className="gap-8 md:gap-12 flex flex-col items-center py-12">
      <div className="flex flex-col gap-6 px-4 max-w-5xl w-full">
        <h1 className="font-medium text-3xl">RSC parser</h1>
        <div className="flex flex-col gap-2">
          <p>
            This is a parser for React Server Components (RSC) when sent over
            the network. React uses a format to represent a tree of
            components/html or metadata such as requiered imports, suspense
            boundaries, and css/fonts that needs to be loaded.
          </p>
          <p>
            See the{" "}
            <Link
              href="https://github.com/alvarlagerlof/rsc-parser"
              className="text-blue-700 dark:text-blue-500"
            >
              Github Repo
            </Link>{" "}
            for more information.
          </p>
        </div>
      </div>
      <Parser />
    </main>
  );
}
