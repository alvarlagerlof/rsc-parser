import { z } from "zod";

const stringOrNumber = z.union([z.string(), z.number()]);

const schema = z.tuple([stringOrNumber, z.array(stringOrNumber), z.string()]);

function groupChunks(array: (string | number)[]) {
  const newArray = [];
  for (let i = 0; i < array.length; i += 2) {
    newArray.push({ name: array[i], path: array[i + 1] });
  }
  return newArray;
}

export function ClientReferenceRow({ data }: { data: string }) {
  const json = JSON.parse(data);
  const parsed = schema.parse(json);

  return (
    <div className="flex flex-col gap-4 dark:text-white">
      <h3 className="text-xl font-semibold">
        Import {parsed[2] == "" ? "unknown" : parsed[2]}
      </h3>
      <p>Id: {parsed[0]}</p>
      <div>
        <h4 className="font-medium">Chunks</h4>
        <ul className="list-inside list-disc">
          {groupChunks(parsed[1]).map((item) => {
            return (
              <li key={item.name}>
                {item.name} - {item.path}
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
