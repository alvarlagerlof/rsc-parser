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
    <div className="flex flex-row gap-1.5 rounded-md border-2 border-transparent bg-slate-200 px-2 py-0.5 transition-all duration-100 group-aria-selected:border-slate-400 dark:bg-slate-800 dark:group-aria-selected:border-slate-500">
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
      <div className="flex h-full flex-col rounded-md border-2 border-transparent bg-red-200 px-2 py-0.5 transition-all duration-200 group-aria-selected:border-red-600 group-aria-selected:text-white">
        <div>Error</div>
        <Meter fraction={rowSize / payloadSize} />
      </div>
    );
  }

  return <span>Error</span>;
}
