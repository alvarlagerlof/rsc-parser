import React, { ReactNode, useState } from 'react';
import { Logo } from './Logo';
import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels';
import { IconButton } from './IconButton';

export function BottomPanel({
  openButton,
  children,
  isOpen,
  position,
}: {
  openButton: ReactNode;
  children: ReactNode;
  isOpen: boolean;
  position: 'bottom' | 'right';
}) {
  const [isDragging, setIsDragging] = useState(false);

  if (isOpen) {
    return (
      <PanelGroup
        direction={position === 'bottom' ? 'vertical' : 'horizontal'}
        // The `pointer-events-none` class is need to be able to click on the content underneath,
        // but if it's applied while dragging, the drag handler looses track very easily.
        // eslint-disable-next-line tailwindcss/classnames-order
        className={`fixed left-0 top-0 size-full z-1000 ${isDragging ? '' : 'pointer-events-none'}`}
      >
        <Panel order={1} defaultSize={55} />
        <PanelResizeHandle
          className={`pointer-events-auto bg-slate-300 dark:bg-slate-700 ${position === 'bottom' ? 'h-3 w-full' : 'h-full w-3'}`}
          onDragging={(isDragging) => {
            setIsDragging(isDragging);
          }}
        />
        <Panel order={2} maxSize={75} minSize={20} defaultSize={45}>
          <div className="pointer-events-auto size-full overflow-y-auto bg-slate-100 scrollbar-gutter-stable dark:bg-slate-900">
            {children}
          </div>
        </Panel>
      </PanelGroup>
    );
  }

  return (
    <div className="fixed bottom-[20px] right-[80px] z-1000 flex size-[40px]">
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
    <IconButton onClick={onClickClose}>
      <svg version="1.1" viewBox="0 0 24 24" className="size-full">
        <title>Close</title>
        <path
          d="M18 18L12 12M12 12L6 6M12 12L18 6M12 12L6 18"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </IconButton>
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

export function BottomPanelPositionSwitchButton({
  currentPosition,
  setCurrentPosition,
}: {
  currentPosition: 'bottom' | 'right';
  setCurrentPosition: (position: 'bottom' | 'right') => void;
}) {
  return (
    <IconButton
      onClick={() => {
        setCurrentPosition(currentPosition === 'bottom' ? 'right' : 'bottom');
      }}
    >
      {currentPosition === 'bottom' ? (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="800px"
          height="800px"
          viewBox="0 0 24 24"
          fill="currentColor"
          className="size-full"
        >
          <title>
            {currentPosition === 'bottom'
              ? 'Position to the right'
              : 'Position on the bottom'}
          </title>
          <path d="M19 3H5c-1.103 0-2 .897-2 2v14c0 1.103.897 2 2 2h14c1.103 0 2-.897 2-2V5c0-1.103-.897-2-2-2zM5 5h9v14H5V5zm11 14V5h3l.002 14H16z" />
        </svg>
      ) : (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="800px"
          height="800px"
          viewBox="0 0 24 24"
          fill="currentColor"
          className="size-full"
        >
          <path fill="none" d="M5 16h14.002v3H5zM5 5h14v9H5z" />
          <path d="M19 3H5c-1.103 0-2 .897-2 2v14c0 1.103.897 2 2 2h14c1.103 0 2-.897 2-2V5c0-1.103-.897-2-2-2zm0 2 .001 9H5V5h14zM5 19v-3h14.002v3H5z" />
        </svg>
      )}
    </IconButton>
  );
}
