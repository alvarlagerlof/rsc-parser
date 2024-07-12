'use client';

// @ts-expect-error Inline styles are not understood by the typescript compiler
import styles from '@rsc-parser/core/style.css?inline';
import {
  ViewerStreams,
  ViewerStreamsEmptyState,
  BottomPanel,
  BottomPanelOpenButton,
  BottomPanelCloseButton,
  BottomPanelPositionSwitchButton,
  Logo,
  RecordButton,
  PanelLayout,
  OverflowButton,
  copyEventsToClipboard,
} from '@rsc-parser/core';
import { fetchPatcher } from '@rsc-parser/core/fetchPatcher';
import React, {
  ReactNode,
  startTransition,
  useCallback,
  useEffect,
  useState,
  useSyncExternalStore,
} from 'react';
import { isRscChunkEvent, RscEvent } from '@rsc-parser/core/events';

export function RscDevtoolsPanel({
  position = 'bottom',
}: {
  position?: 'bottom' | 'right' | undefined;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentPosition, setCurrentPosition] = useState(position);

  useEffect(() => {
    const localStoragePosition = localStorage.getItem(
      'rscDevtoolsPanelPosition',
    );

    if (
      typeof localStoragePosition === 'string' &&
      (localStoragePosition === 'bottom' || localStoragePosition === 'right')
    ) {
      setCurrentPosition(localStoragePosition);
    }
  }, []);

  const {
    isRecording,
    startRecording,
    events,
    clearEvents,
    readNextScriptTags,
  } = useRscEvents();

  return (
    <ApplyStylingOnClient>
      <BottomPanel
        isOpen={isOpen}
        openButton={
          <BottomPanelOpenButton onClickOpen={() => setIsOpen(true)} />
        }
        position={currentPosition}
      >
        <PanelLayout
          header={
            <>
              <Logo variant="wide" />
              <RecordButton
                isRecording={isRecording}
                onClickRecord={startRecording}
              />
            </>
          }
          buttons={
            <>
              <OverflowButton
                menuItems={
                  <>
                    <button onClick={() => clearEvents()}>Clear events</button>
                    {process.env.NODE_ENV === 'development' ? (
                      <button
                        onClick={() => {
                          copyEventsToClipboard({ events });
                        }}
                      >
                        Copy events to clipboard
                      </button>
                    ) : null}
                    <button
                      onClick={() => {
                        readNextScriptTags();
                      }}
                    >
                      Read Next.js script tag payload
                    </button>
                  </>
                }
              />
              <BottomPanelPositionSwitchButton
                currentPosition={currentPosition}
                setCurrentPosition={setCurrentPosition}
              />
              <BottomPanelCloseButton onClickClose={() => setIsOpen(false)} />
            </>
          }
        >
          {events.length === 0 || !isRecording ? (
            <ViewerStreamsEmptyState />
          ) : (
            <ViewerStreams events={events} />
          )}
        </PanelLayout>
      </BottomPanel>
    </ApplyStylingOnClient>
  );
}

const emptySubscribe = () => () => {};

function ApplyStylingOnClient({ children }: { children: ReactNode }) {
  const isClient = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false,
  );

  const [polyfillIsLoaded, setPolyfillIsLoaded] = useState(false);

  useEffect(() => {
    if (!isClient) {
      return;
    }

    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = 'https://unpkg.com/style-scoped@0/scoped.min.js';

    script.addEventListener('load', () => {
      setPolyfillIsLoaded(true);
    });

    document.head.appendChild(script);
  }, [isClient]);

  if (!isClient || !polyfillIsLoaded) {
    return null;
  }

  return (
    <div>
      <style scoped>{styles}</style>
      {children}
    </div>
  );
}

function useRscEvents() {
  const [events, setEvents] = useState<RscEvent[]>([]);
  const [isRecording, setIsRecording] = useState(false);

  useEffect(() => {
    if (!isRecording) {
      return;
    }

    fetchPatcher({
      onRscEvent: (event) => {
        if (
          isRscChunkEvent(event) &&
          events
            .filter(isRscChunkEvent)
            .some((item) =>
              arraysEqual(
                item.data.chunkValue,
                Array.from(event.data.chunkValue),
              ),
            )
        ) {
          return true;
        }

        startTransition(() => {
          setEvents((previous) => [...previous, event]);
        });
      },
    });
  }, [isRecording]);

  const startRecording = useCallback(() => {
    setIsRecording(true);
  }, []);

  const clearEvents = useCallback(() => {
    setEvents([]);
  }, []);

  const readNextScriptTags = useCallback(() => {
    try {
      // @ts-expect-error This is a hack
      const payload = self.__next_f.map((f) => f?.[1]).join('');

      const requestId = String(Date.now() + Math.random()); // TODO: Use a better random number generator or uuid

      const events = [
        {
          type: 'RSC_REQUEST',
          data: {
            requestId: requestId,
            tabId: 0,
            timestamp: Date.now(),
            url: window.location.href,
            method: 'GET',
            headers: {},
          },
        },
        {
          type: 'RSC_RESPONSE',
          data: {
            requestId: requestId,
            tabId: 0,
            timestamp: Date.now(),
            status: 200,
            headers: {},
          },
        },
        {
          type: 'RSC_CHUNK',
          data: {
            requestId: requestId,
            tabId: 0,
            timestamp: Date.now(),
            chunkValue: Array.from(new TextEncoder().encode(payload)),
          },
        },
      ] satisfies RscEvent[];

      setIsRecording(true);
      startTransition(() => {
        setEvents(() => events);
      });
    } catch (error) {
      console.error(
        new Error('Error parsing Next.js payload', {
          cause: error,
        }),
      );
    }
  }, []);

  return {
    isRecording,
    startRecording,
    events,
    clearEvents,
    readNextScriptTags,
  };
}

function arraysEqual(a: unknown[], b: unknown[]) {
  if (a === b) {
    return true;
  }
  if (a == null || b == null) {
    return false;
  }
  if (a.length !== b.length) {
    return false;
  }

  // If you don't care about the order of the elements inside
  // the array, you should sort both arrays here.
  // Please note that calling sort on an array will modify that array.
  // you might want to clone your array first.

  for (let i = 0; i < a.length; ++i) {
    if (a[i] !== b[i]) {
      return false;
    }
  }
  return true;
}
