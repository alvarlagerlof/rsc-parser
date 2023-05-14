import { z } from "zod";
import { JSONTree } from "react-json-tree";

const inner = z
  .tuple([
    z.literal("$").describe("component"),
    z.string().describe("element type"),
    z.union([z.null(), z.string().describe("maybe id")]),
    z.intersection(
      z.object({
        children: z.union([
          z.array(z.unknown().nullable()).optional(),
          z.unknown(),
        ]),
      }),
      z.record(z.string(), z.unknown())
    ),
  ])
  .nullable();

const other = z.array(z.unknown());

const rscComponentSchema = z.union([inner, other]);

export function DataLine({ data }: { data: string }) {
  const json = JSON.parse(data);

  const transform = () => {
    const walk = (
      children: z.infer<typeof rscComponentSchema>[]
    ): z.infer<typeof rscComponentSchema>[] => {
      return children.map((component) => {
        const result = inner.safeParse(component);

        if (result.success) {
          if (result.data === null) {
            return null;
          }

          const data = result.data[3];
          const { children } = data;
          if (typeof children !== "undefined" && Array.isArray(children)) {
            const newResult: z.infer<typeof rscComponentSchema> = [
              result.data[0],
              result.data[1],
              result.data[2],
              {
                ...result.data[3],
                children: walk(
                  children as z.infer<typeof rscComponentSchema>[]
                ),
              },
            ];
            return newResult;
          } else {
            const newResult: z.infer<typeof rscComponentSchema> = [
              result.data[0],
              result.data[1],
              result.data[2],
              result.data[3],
            ];
            return newResult;
          }
        } else if (Array.isArray(component)) {
          const result = other.safeParse(component);

          if (result.success) {
            const data = result.data;
            return walk(data as z.infer<typeof rscComponentSchema>[]);
          }
        } else if (typeof component === "string") {
          return component;
        } else if (typeof component === "object") {
          return component;
        } else if (typeof component === "boolean") {
          return component;
        }

        return null;
      });
    };

    return {
      ...json,
      parsed: Array.isArray(json)
        ? { data: walk(json), success: true }
        : { data: json, success: true },
    };
  };

  const result = transform();

  return <JSONTree data={result.parsed.data} />;
}
