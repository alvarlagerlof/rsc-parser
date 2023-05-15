import { Parser } from "./Parser";

export default function Home() {
  return (
    <main className="gap-12 flex flex-col items-center">
      <div className="flex flex-col gap-1 px-24 pt-12 max-w-5xl w-full">
        <h1 className="font-medium text-3xl">RSC parser</h1>
        <p>This is a parser attempting to make sense of the RSC wire format.</p>
      </div>
      <Parser />
    </main>
  );
}
