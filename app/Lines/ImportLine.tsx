import { z } from "zod";
import { ClientReferenceMetadata } from "../parse-payload";

const stringOrNumber = z.union([z.string(), z.number()]);

const schema = z
  .object({
    async: z.boolean().optional(),
    id: stringOrNumber,
    name: z.string(),
    chunks: z.array(stringOrNumber),
  })
  .strict();

export function ImportLine({ meta }: { meta: ClientReferenceMetadata }) {
  return (
    <div className="flex flex-col">
      <h3 className="text-3xl font-semibold mb-4">
        Import {meta.name ? `"${meta.name}"` : "unknown"}
      </h3>
      <p className="mb-8">ID: {meta.id}</p>
      <h4 className="font-semibold">Chunks</h4>
      <ul className="list-disc ml-4">
        {meta.chunks.map((item) => {
          return <li key={item}>{item}</li>;
        })}
      </ul>
    </div>
  );
}
