import { lexer, parse, refineRowType } from "../../parse";
import { stringToKiloBytes } from "./stringToKiloBytes";
import { Meter } from "../../Meter";

export function RowTab({
  row,
  payloadSize,
}: {
  row: string;
  payloadSize: number;
}) {
  const rowSize = parseFloat(stringToKiloBytes(row));
  const tokens = lexer(row);
  const { identifier, type } = parse(tokens);
  const refinedType = refineRowType(type);

  return (
    <div className="flex flex-row gap-1.5 rounded-xl bg-slate-200 px-2 py-1 transition-all duration-150 group-aria-selected:bg-blue-300  dark:bg-slate-800  dark:group-aria-selected:bg-blue-700">
      <div className="-mt-px text-xl font-semibold">{identifier}</div>
      <div className="flex flex-col items-start">
        <div className="whitespace-nowrap">{refinedType}</div>
        <Meter fraction={rowSize / payloadSize} />
      </div>
    </div>
  );
}

export function RowTabFallback({
  error,
  row,
  payloadSize,
}: {
  error: Error;
  row: string;
  payloadSize: number;
}) {
  const rowSize = parseFloat(stringToKiloBytes(row));

  if (error instanceof Error) {
    return (
      <div className="flex h-full flex-col rounded-xl bg-red-200 px-2 py-1 transition-all duration-200 group-aria-selected:bg-red-600 group-aria-selected:text-white">
        <div>Error</div>
        <Meter fraction={rowSize / payloadSize} />
      </div>
    );
  }

  return <span>Error</span>;
}
