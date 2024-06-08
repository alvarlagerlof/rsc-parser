import React, { ReactNode, useState } from "react";
import { Logo } from "./Logo";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";

export function BottomPanel({
  openButton,
  children,
  isOpen,
}: {
  openButton: ReactNode;
  children: ReactNode;
  isOpen: boolean;
}) {
  const [isDragging, setIsDragging] = useState(false);

  if (isOpen) {
    return (
      <PanelGroup
        direction="vertical"
        // The `pointer-events-none` class is need to be able to click on the content underneath,
        // but if it's applied while dragging, the drag handler looses track very easily.
        // eslint-disable-next-line tailwindcss/classnames-order
        className={`fixed left-0 top-0 size-full z-[1000] ${isDragging ? "" : "pointer-events-none"}`}
      >
        <Panel order={1} defaultSize={70} />
        <PanelResizeHandle
          className="pointer-events-auto h-3 w-full bg-slate-300 dark:bg-slate-700"
          onDragging={(isDragging) => {
            setIsDragging(isDragging);
          }}
        />
        <Panel order={2} maxSize={75} minSize={20} defaultSize={30}>
          <div className="pointer-events-auto size-full overflow-y-auto bg-slate-100 scrollbar-gutter-stable dark:bg-slate-900">
            {children}
          </div>
        </Panel>
      </PanelGroup>
    );
  }

  return (
    <div className="fixed bottom-[20px] right-[80px] z-[1000] flex size-[40px]">
      {openButton}
    </div>
  );
}

export function BottomPanelCloseButton({
  onClickClose,
}: {
  onClickClose: () => void;
}) {
  return (
    <button
      className="rounded-full bg-slate-300 p-1 text-black  dark:bg-slate-700 dark:text-white"
      onClick={onClickClose}
    >
      <svg version="1.1" viewBox="0 0 24 24" className="size-6">
        <path
          d="M18 18L12 12M12 12L6 6M12 12L18 6M12 12L6 18"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </button>
  );
}

export function BottomPanelOpenButton({
  onClickOpen,
}: {
  onClickOpen: () => void;
}) {
  return (
    <button
      onClick={onClickOpen}
      className="size-10 rounded-full bg-slate-300 dark:bg-slate-700"
    >
      <Logo variant="small" />
    </button>
  );
}
