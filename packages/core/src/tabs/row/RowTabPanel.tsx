import { useState, useTransition } from "react";
import { ErrorBoundary } from "react-error-boundary";
import * as Ariakit from "@ariakit/react";

import { lexer, parse, refineRowType } from "../../parse";
import { GenericErrorBoundaryFallback } from "../../GenericErrorBoundaryFallback";
import { Meter } from "../../Meter";
import { stringToKiloBytes } from "./stringToKiloBytes";
import { ClientReferenceRow } from "../../rows/ClientReferenceRow";
import { HintRow } from "../../rows/HintRow";
import { TreeRow } from "../../rows/TreeRow";
import { DownArrowIcon, RightArrowIcon } from "../../icons";
import { Chunk } from "../../test";

export function RowTabPanel({
  row,
  payloadSize,
  selectTabByIdentifier,
}: {
  row: Chunk;
  payloadSize: number;
  selectTabByIdentifier: (tabIdentifier: string) => void;
}) {
  return (
    <div className="flex flex-col divide-y-1 dark:divide-slate-600">
      <div className="pb-3">
        <div className="flex flex-row justify-between">
          <ErrorBoundary
            FallbackComponent={GenericErrorBoundaryFallback}
            key={`meta-${row.toString()}`}
          >
            <RowTabPanelMeta row={row} />
          </ErrorBoundary>
          <ErrorBoundary
            FallbackComponent={GenericErrorBoundaryFallback}
            key={`size-${row.toString()}`}
          >
            <RowTabPanelSize row={row} payloadSize={payloadSize} />
          </ErrorBoundary>
        </div>

        <ErrorBoundary
          FallbackComponent={GenericErrorBoundaryFallback}
          key={`row-${row.toString()}`}
        >
          <RowTabPanelExplorer
            row={row}
            selectTabByIdentifier={selectTabByIdentifier}
          />
        </ErrorBoundary>
      </div>

      <div className="pt-3">
        <ErrorBoundary
          FallbackComponent={GenericErrorBoundaryFallback}
          key={`tree-${row.toString()}`}
        >
          <RowTabPanelGenericData row={row} />
        </ErrorBoundary>
      </div>
    </div>
  );
}

function RowTabPanelMeta({ row }: { row: Chunk }) {
  // const tokens = lexer(row);
  // const { identifier, type } = parse(tokens);
  // const refinedType = refineRowType(type);

  const identifier = row.id;
  const refinedType = row.type;
  const type = row.type;

  return (
    <div className="flex flex-col gap-1">
      <h3 className="inline-block rounded-md text-xl font-bold dark:text-white">
        {identifier}{" "}
        <span className="text-slate-400 dark:text-slate-200">
          / $L{identifier}
        </span>
      </h3>
      <h4 className="font-medium dark:text-white">
        {refinedType}{" "}
        {/* <span className="text-slate-400 dark:text-slate-200">
          / &quot;{type}&quot;
        </span>{" "} */}
      </h4>
    </div>
  );
}

function RowTabPanelSize({
  row,
  payloadSize,
}: {
  row: Chunk;
  payloadSize: number;
}) {
  //const rowSize = parseFloat(stringToKiloBytes(row));
  const rowSize = 0;

  return (
    <div className="text-right dark:text-white">
      <div className="whitespace-nowrap">{rowSize} KB row (uncompressed)</div>
      <div>{((rowSize / payloadSize) * 100).toFixed(2)}% of total</div>
      <Meter fraction={rowSize / payloadSize} />
    </div>
  );
}

export function RowTabPanelExplorer({
  row,
  selectTabByIdentifier,
}: {
  row: Chunk;
  selectTabByIdentifier: (tabIdentifier: string) => void;
}) {
  // const tokens = lexer(row);
  // const { type, data } = parse(tokens);

  // const refinedType = refineRowType(type);

  const refinedType = row.type;
  const data = row.value;
  // const type = row.type;

  switch (refinedType) {
    case "module":
      // This is a bit iffy. Should probably have separate names for these.
      return <ClientReferenceRow data={data} />;
    case "hint":
      return <HintRow data={data} />;
    case "tree":
      return (
        <div className="max-w-full overflow-x-auto">
          <TreeRow
            data={data}
            onClickClientReference={(name) => {
              const buttonIdentifier = name.replace("$L", "");
              selectTabByIdentifier(buttonIdentifier);
            }}
          />
        </div>
      );
    case "text":
      return <p className="dark:text-white">{data}</p>;
    // case "unknown":
    //   throw new Error(`Unknown row type: ${type}`);
  }
}

function RowTabPanelGenericData({ row }: { row: Chunk }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const disclosure = Ariakit.useDisclosureStore({
    open: isOpen,
    setOpen: (open) => {
      startTransition(() => {
        setIsOpen(open);
      });
    },
  });

  return (
    <div className="flex flex-col gap-2">
      <Ariakit.Disclosure
        store={disclosure}
        style={{ opacity: isPending ? 0.7 : 1 }}
        className="flex cursor-pointer items-center gap-1 dark:text-white"
      >
        {isOpen ? <DownArrowIcon /> : <RightArrowIcon />}
        Raw data
      </Ariakit.Disclosure>
      <Ariakit.DisclosureContent store={disclosure}>
        {isOpen ? <RowTabRawJson row={row} /> : null}
      </Ariakit.DisclosureContent>
    </div>
  );
}

function RowTabRawJson({ row }: { row: Chunk }) {
  // const tokens = lexer(row);
  // const { data } = parse(tokens);
  // const json = JSON.parse(data);
  const json = JSON.parse(row.value);

  return (
    <pre className="overflow-hidden whitespace-break-spaces break-all text-sm dark:text-white">
      {JSON.stringify(json, null, 1)}
    </pre>
  );
}
