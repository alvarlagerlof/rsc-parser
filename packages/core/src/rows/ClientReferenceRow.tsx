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
    <div className="flex flex-col dark:text-white">
      <h3 className="mb-4 text-xl font-semibold">
        Import {parsed.name ? `"${parsed.name}"` : "unknown"}
      </h3>
      <p className="mb-8">ID: {parsed.id}</p>
      <h4 className="font-medium">Chunks</h4>
      <ul className="ml-4 list-disc">
        {parsed.chunks.map((item) => {
          return <li key={item}>{item}</li>;
        })}
      </ul>
    </div>
  );
}
