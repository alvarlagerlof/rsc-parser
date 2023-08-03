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

export function RowTabPanel({
  row,
  payloadSize,
  selectTabByIdentifier,
}: {
  row: string;
  payloadSize: number;
  selectTabByIdentifier: (tabIdentifier: string) => void;
}) {
  return (
    <div className="flex flex-col gap-6">
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

      <div className="h-0.5 w-full bg-slate-300 dark:bg-slate-600" />

      <ErrorBoundary
        FallbackComponent={GenericErrorBoundaryFallback}
        key={`row-${row.toString()}`}
      >
        <RowTabPanelExplorer
          row={row}
          selectTabByIdentifier={selectTabByIdentifier}
        />
      </ErrorBoundary>

      <div className="h-0.5 w-full bg-slate-300 dark:bg-slate-600" />

      <ErrorBoundary
        FallbackComponent={GenericErrorBoundaryFallback}
        key={`tree-${row.toString()}`}
      >
        <RowTabPanelGenericData row={row} />
      </ErrorBoundary>
    </div>
  );
}

function RowTabPanelMeta({ row }: { row: string }) {
  const tokens = lexer(row);
  const { identifier, type } = parse(tokens);
  const refinedType = refineRowType(type);

  return (
    <div className="flex flex-col gap-1">
      <h3 className="inline-block rounded-full text-xl font-bold dark:text-white">
        {identifier}{" "}
        <span className="text-slate-400 dark:text-slate-200">
          / $L{identifier}
        </span>
      </h3>
      <h4 className="font-medium dark:text-white">
        {refinedType}{" "}
        <span className="text-slate-400 dark:text-slate-200">
          / &quot;{type}&quot;
        </span>{" "}
      </h4>
    </div>
  );
}

function RowTabPanelSize({
  row,
  payloadSize,
}: {
  row: string;
  payloadSize: number;
}) {
  const rowSize = parseFloat(stringToKiloBytes(row));

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
  row: string;
  selectTabByIdentifier: (tabIdentifier: string) => void;
}) {
  const tokens = lexer(row);
  const { type, data } = parse(tokens);

  const refinedType = refineRowType(type);

  switch (refinedType) {
    case "client ref":
      // This is a bit iffy. Should probably have separate names for these.
      return <ClientReferenceRow data={data} />;
    case "hint":
      return <HintRow data={data} />;
    case "tree":
      return (
        <TreeRow
          data={data}
          onClickClientReference={(name) => {
            const buttonIdentifier = name.replace("$L", "");
            selectTabByIdentifier(buttonIdentifier);
          }}
        />
      );
    case "unknown":
      throw new Error(`Unknown row type: ${type}`);
  }
}

function RowTabPanelGenericData({ row }: { row: string }) {
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
    <>
      <Ariakit.Disclosure
        store={disclosure}
        style={{ opacity: isPending ? 0.7 : 1 }}
        className="flex cursor-pointer items-center gap-1"
      >
        {isOpen ? <DownArrowIcon /> : <RightArrowIcon />}
        Raw data
      </Ariakit.Disclosure>
      <Ariakit.DisclosureContent store={disclosure}>
        {isOpen ? <RowTabRawJson row={row} /> : null}
      </Ariakit.DisclosureContent>
    </>
  );
}

function RowTabRawJson({ row }: { row: string }) {
  const tokens = lexer(row);
  const { data } = parse(tokens);
  const json = JSON.parse(data);

  return (
    <pre className="overflow-hidden whitespace-break-spaces break-all text-sm">
      {JSON.stringify(json, null, 1)}
    </pre>
  );
}
