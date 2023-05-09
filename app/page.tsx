import { Parser } from "./Parser";

export default function Home() {
  return (
    <main className="p-24 gap-12 flex flex-col">
      <div className="flex flex-col gap-1">
        <h1 className="font-medium text-3xl">RSC parser</h1>
        <p>This is a parser attempting to make sense of the RSC wire format.</p>
      </div>
      <Parser />
    </main>
  );
}
