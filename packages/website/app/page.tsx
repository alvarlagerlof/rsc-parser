import { Metadata } from "next";
import Link from "next/link";

import { PayloadViewerClientWrapper } from "./PayloadViewerClientWrapper";

export const metadata: Metadata = {
  title: "RSC Parser",
};

export default function Home() {
  return (
    <main className="flex flex-col items-center py-12">
      <div className="flex w-full max-w-7xl flex-col gap-12 px-4">
        <section className="flex flex-col gap-4">
          <h1 className="text-3xl font-medium">RSC parser</h1>
          <div className="flex flex-col gap-2">
            <p>
              This is a parser for React Server Components (RSC) when sent over
              the network. React uses a format to represent a tree of
              components/html or metadata such as required imports, suspense
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
        </section>
        <PayloadViewerClientWrapper />
      </div>
    </main>
  );
}
