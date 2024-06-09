import React, {
  startTransition,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  ViewerStreams,
  ViewerStreamsEmptyState,
  PanelLayout,
  Logo,
  RecordButton,
  OverflowButton,
  copyEventsToClipboard,
} from "@rsc-parser/core";
import "@rsc-parser/core/style.css";
import {
  RscEvent,
  StartRecordingEvent,
  isEvent,
  isRscChunkEvent,
  isRscEvent,
  isStopRecordingEvent,
} from "@rsc-parser/core/events";

export function RscDevtoolsExtension() {
  const { isRecording, startRecording, events, clearEvents } = useRscEvents();

  return (
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
                {process.env.NODE_ENV === "development" ? (
                  <button
                    onClick={() => {
                      copyEventsToClipboard({ events });
                    }}
                  >
                    Copy events to clipboard
                  </button>
                ) : null}
              </>
            }
          />
        </>
      }
    >
      {events.length === 0 || !isRecording ? (
        <ViewerStreamsEmptyState />
      ) : (
        <ViewerStreams events={events} />
      )}
    </PanelLayout>
  );
}

function useRscEvents() {
  const [events, setEvents] = useState<RscEvent[]>([]);
  const [isRecording, setIsRecording] = useState(false);
  const tabId = useMemo(() => Date.now(), []);

  useEffect(() => {
    function handleEvent(
      request: unknown,
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      _sender: unknown,
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      _sendResponse: unknown,
    ) {
      if (!isEvent(request)) {
        return true;
      }

      // If the event is from a different tab, ignore it
      if (request.data.tabId !== tabId) {
        return true;
      }

      if (isStopRecordingEvent(request)) {
        setIsRecording(false);
        setEvents([]);
        return true;
      }

      if (!isRscEvent(request)) {
        return true;
      }

      // It's possible that this lookup will miss a duplicated event if another
      // one is being added at the same time. I haven't seen this happen in practice.
      if (
        isRscChunkEvent(request) &&
        events
          .filter(isRscChunkEvent)
          .some((item) =>
            arraysEqual(item.data.chunkValue, request.data.chunkValue),
          )
      ) {
        return true;
      }

      startTransition(() => {
        setEvents((previous) => [...previous, request]);
      });

      return true;
    }

    chrome.runtime.onMessage.addListener(handleEvent);

    return () => {
      chrome.runtime.onMessage.removeListener(handleEvent);
    };
  }, []);

  const startRecording = useCallback(() => {
    setIsRecording(true);
    chrome.tabs.sendMessage(chrome.devtools.inspectedWindow.tabId, {
      type: "START_RECORDING",
      data: {
        tabId: tabId,
      },
    } satisfies StartRecordingEvent);
  }, [tabId]);

  const clearEvents = useCallback(() => {
    setEvents([]);
  }, []);

  return {
    isRecording,
    startRecording,
    events,
    clearEvents,
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
