import { z } from "zod";

const stringOrNumber = z.union([z.string(), z.number()]);

const schema = z
  .object({
    async: z.boolean().optional(),
    id: stringOrNumber,
    name: z.string(),
    chunks: z.array(stringOrNumber),
  })
  .strict();

export function ClientReferenceRow({ data }: { data: string }) {
  const json = JSON.parse(data);
  const parsed = schema.parse(json);

  return (
    <div className="flex flex-col">
      <h3 className="text-3xl font-semibold mb-4">
        Import {parsed.name ? `"${parsed.name}"` : "unknown"}
      </h3>
      <p className="mb-8">ID: {parsed.id}</p>
      <h4 className="font-semibold">Chunks</h4>
      <ul className="list-disc ml-4">
        {parsed.chunks.map((item) => {
          return <li key={item}>{item}</li>;
        })}
      </ul>
    </div>
  );
}
