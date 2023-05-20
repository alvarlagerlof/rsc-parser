import { z } from "zod";
import { HintModel } from "../parse-payload";

const schema = z.tuple([
  z.string(),
  z.union([
    z.object({ as: z.literal("font"), type: z.string() }).strict(),
    z.object({ as: z.literal("style") }).strict(),
  ]),
]);

export function AssetLine({ code, value }: { code: string; value: HintModel }) {
  const parsed = schema.parse([code, value]);

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-4">
        <h3 className="text-3xl font-semibold">
          Load asset of type &quot;{parsed[1].as}&quot;
        </h3>
        {"type" in parsed[1] ? <p>Type: {parsed[1].type}</p> : null}
      </div>
      <p>{parsed[0]} </p>
    </div>
  );
}
