import { z } from "zod";
import { parseLine } from "../parse";

const schema = z
  .object({
    async: z.boolean(),
    id: z.string(),
    name: z.string(),
    chunks: z.array(z.string()),
  })
  .strict();

export function ImportLine({ line }: { line: ReturnType<typeof parseLine> }) {
  const json = JSON.parse(line.rawJson);

  const parsed = schema.parse(json);

  return (
    <table className="inline-block text-left table-auto">
      <thead>
        <tr>
          <th className="border border-gray-400 p-2">Key</th>
          <th className="border border-gray-400 p-2">Value</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td className="border border-gray-400 p-2">Async</td>
          <td className="border border-gray-400 p-2">{String(parsed.async)}</td>
        </tr>
        <tr>
          <td className="border border-gray-400 p-2">Name</td>
          <td className="border border-gray-400 p-2">{parsed.name}</td>
        </tr>
        <tr>
          <td className="border border-gray-400 p-2">ID</td>
          <td className="border border-gray-400 p-2">{parsed.id}</td>
        </tr>
        <tr>
          <td className="border border-gray-400 p-2">Chunks</td>
          <td className="border border-gray-400 p-2">
            <ul className="">
              {/* @ts-ignore */}
              {parsed.chunks.map((item) => {
                return <li key={item}>{item}</li>;
              })}
            </ul>
          </td>
        </tr>
      </tbody>
    </table>
  );
}
