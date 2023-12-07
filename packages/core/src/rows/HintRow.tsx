import { z } from "zod";

const schema = z.union([
  z.tuple([z.string(), z.string()]),

  z.tuple([
    z.string(),
    z.string(),
    z.union([
      z.object({ crossOrigin: z.string(), type: z.string() }).strict(),
      z.object({ crossOrigin: z.string() }).strict(),
    ]),
  ]),
]);

export function HintRow({ data }: { data: string }) {
  const json = JSON.parse(data);
  const parsed = schema.parse(json);

  return (
    <div className="flex flex-col gap-3 text-black dark:text-white">
      <div className="flex flex-col gap-4">
        <h3 className="text-xl font-semibold">
          Load asset of type &quot;{parsed[1]}&quot;
        </h3>
      </div>
      <p>Path: {parsed[0]}</p>
      {parsed[2] ? (
        <p>
          Settings: <pre>{JSON.stringify(parsed[2], null, 2)}</pre>
        </p>
      ) : null}
    </div>
  );
}
