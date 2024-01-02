import { useState, useTransition } from "react";
import { ErrorBoundary } from "react-error-boundary";
import * as Ariakit from "@ariakit/react";

import { GenericErrorBoundaryFallback } from "../../GenericErrorBoundaryFallback";
import { Meter } from "../../Meter";
import { stringToKiloBytes } from "./stringToKiloBytes";
import { ClientReferenceRow } from "../../rows/ClientReferenceRow";
import { HintRow } from "../../rows/HintRow";
import { TreeRow } from "../../rows/TreeRow";
import { DownArrowIcon, RightArrowIcon } from "../../icons";
import { Chunk } from "../../react/ReactFlightClient";

export function RowTabPanel({
  row,
  payloadSize,
  selectTabByID,
}: {
  row: Chunk;
  payloadSize: number;
  selectTabByID: (id: string) => void;
}) {
  return (
    <div className="flex flex-col divide-y-1 dark:divide-slate-600">
      <div className="flex flex-row justify-between pb-3">
        <ErrorBoundary
          FallbackComponent={GenericErrorBoundaryFallback}
          key={`meta-${row.id}`}
        >
          <RowTabPanelMeta row={row} />
        </ErrorBoundary>
        <ErrorBoundary
          FallbackComponent={GenericErrorBoundaryFallback}
          key={`size-${row.id}`}
        >
          <RowTabPanelSize row={row} payloadSize={payloadSize} />
        </ErrorBoundary>
      </div>

      <div className="py-3">
        <ErrorBoundary
          FallbackComponent={GenericErrorBoundaryFallback}
          key={`row-${row.id}`}
        >
          <RowTabPanelExplorer row={row} selectTabByID={selectTabByID} />
        </ErrorBoundary>
      </div>

      <div className="pt-3">
        <ErrorBoundary
          FallbackComponent={GenericErrorBoundaryFallback}
          key={`tree-${row.id}`}
        >
          <RowTabPanelGenericData row={row} />
        </ErrorBoundary>
      </div>
    </div>
  );
}

function RowTabPanelMeta({ row }: { row: Chunk }) {
  return (
    <div className="flex flex-col gap-1">
      <h3 className="inline-block rounded-md text-xl font-bold dark:text-white">
        {row.id}
      </h3>
      <h4 className="font-medium dark:text-white">{row.type}</h4>
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
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { _response, ...rowWithoutResponse } = row;
  const rowSize = parseFloat(
    stringToKiloBytes(JSON.stringify(rowWithoutResponse)),
  );

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
  selectTabByID,
}: {
  row: Chunk;
  selectTabByID: (id: string) => void;
}) {
  switch (row.type) {
    case "model": {
      return (
        <TreeRow
          data={row.value}
          onClickID={(id) => {
            selectTabByID(id);
          }}
        />
      );
    }
    case "module": {
      return <ClientReferenceRow data={row.value} />;
    }
    case "hint": {
      return <HintRow data={row.value} />;
    }
    case "text":
      return <p className="dark:text-white">{row.value}</p>;
    default: {
      return null;
    }
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
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { _response, ...rowWithoutResponse } = row;

  return (
    <pre className="overflow-hidden whitespace-break-spaces break-all text-sm dark:text-white">
      {JSON.stringify(rowWithoutResponse, null, 1)}
    </pre>
  );
}
