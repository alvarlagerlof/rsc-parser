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
  RscEvent,
  PanelLayout,
  Logo,
  RecordButton,
  OverflowButton,
  copyEventsToClipboard,
  isRscEvent,
} from "@rsc-parser/core";
import "@rsc-parser/core/style.css";

export function App() {
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
    function handleMessage(
      request: unknown,
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      _sender: unknown,
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      _sendResponse: unknown,
    ) {
      if (!isRscEvent(request) && !isContentScriptUnloadedEvent(request)) {
        return true;
      }

      // If the message is from a different tab, ignore it
      if (request.tabId !== tabId) {
        return true;
      }

      if (isContentScriptUnloadedEvent(request)) {
        setIsRecording(false);
        setEvents([]);
        return true;
      }

      // It's possible that this lookup will miss a duplicated message if another
      // one is being added at the same time. I haven't seen this happen in practice.
      if (
        events.some((item) =>
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

    chrome.runtime.onMessage.addListener(handleMessage);

    return () => {
      chrome.runtime.onMessage.removeListener(handleMessage);
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

type StartRecordingEvent = {
  type: "START_RECORDING";
  data: {
    tabId: number;
  };
};

type ContentScriptUnloadedEvent = {
  type: "CONTENT_SCRIPT_UNLOADED";
  data: {
    tabId: number;
  };
};

function isContentScriptUnloadedEvent(
  event: unknown,
): event is ContentScriptUnloadedEvent {
  return (
    (event as ContentScriptUnloadedEvent).type === "CONTENT_SCRIPT_UNLOADED"
  );
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
