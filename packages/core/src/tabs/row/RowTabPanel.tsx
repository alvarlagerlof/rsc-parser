import { ReactNode } from "react";
import { lexer, parse, refineRowType } from "../../parse";
import { ErrorBoundary } from "react-error-boundary";
import { GenericErrorBoundaryFallback } from "../../GenericErrorBoundaryFallback";
import { Meter } from "../../Meter";
import { JSONTree } from "react-json-tree";
import { stringToKiloBytes } from "./stringToKiloBytes";
import { ClientReferenceRow } from "../../rows/ClientReferenceRow";
import { HintRow } from "../../rows/HintRow";
import { TreeRow } from "../../rows/TreeRow";

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
        key={`tree.${row.toString()}`}
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
      <h3 className="inline-block rounded-full text-xl font-bold">
        {identifier} <span className="text-slate-400">/ $L{identifier}</span>
      </h3>
      <h4 className="font-medium">
        {refinedType}{" "}
        <span className="text-slate-400">/ &quot;{type}&quot;</span>{" "}
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
    <div className="text-right">
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
  const tokens = lexer(row);
  const { data } = parse(tokens);

  return (
    <div className="flex flex-col gap-2">
      <RowTabDetails summary="JSON Parsed Data">
        <ErrorBoundary
          FallbackComponent={GenericErrorBoundaryFallback}
          key={`raw-json-${data.toString()}`}
        >
          <RowTabRawJson data={data} />
        </ErrorBoundary>
      </RowTabDetails>

      <RowTabDetails summary="Raw Data">{data}</RowTabDetails>
    </div>
  );
}

function RowTabDetails({
  summary,
  children,
}: {
  summary: string;
  children: ReactNode;
}) {
  return (
    <details className="rounded-lg bg-slate-300 p-3 dark:bg-slate-700">
      <summary className="cursor-pointer">{summary}</summary>
      <div className="pt-4">
        <pre className="whitespace-normal break-all text-sm">{children}</pre>
      </div>
    </details>
  );
}

function RowTabRawJson({ data }: { data: string }) {
  const json = JSON.parse(data);

  return <JSONTree data={json} shouldExpandNodeInitially={() => true} />;
}
