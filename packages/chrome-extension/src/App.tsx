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
  RscChunkMessage,
  PanelLayout,
  Logo,
  RecordButton,
  copyMessagesToClipBoard,
} from "@rsc-parser/core";
import "@rsc-parser/core/style.css";

export function App() {
  const { isRecording, startRecording, messages, clearMessages } =
    useRscMessages();

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
          <button onClick={() => clearMessages()}>Clear messages</button>
          {process.env.NODE_ENV === "development" ? (
            <button
              onClick={() => {
                copyMessagesToClipBoard({ messages });
              }}
            >
              Copy messages to clipboard
            </button>
          ) : null}
        </>
      }
    >
      {messages.length === 0 || !isRecording ? (
        <ViewerStreamsEmptyState />
      ) : (
        <ViewerStreams messages={messages} />
      )}
    </PanelLayout>
  );
}

function useRscMessages() {
  const [messages, setMessages] = useState<RscChunkMessage[]>([]);
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
      if (
        !isRscChunkMessage(request) &&
        !isContentScriptUnloadedMessage(request)
      ) {
        return true;
      }

      // If the message is from a different tab, ignore it
      if (request.tabId !== tabId) {
        return true;
      }

      if (isContentScriptUnloadedMessage(request)) {
        setIsRecording(false);
        setMessages([]);
        return true;
      }

      // It's possible that this lookup will miss a duplicated message if another
      // one is being added at the same time. I haven't seen this happen in practice.
      if (
        messages.some((item) =>
          arraysEqual(item.data.chunkValue, request.data.chunkValue),
        )
      ) {
        return true;
      }

      startTransition(() => {
        setMessages((previous) => [...previous, request]);
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
      tabId: tabId,
    } satisfies StartRecordingMessage);
  }, [tabId]);

  const clearMessages = useCallback(() => {
    setMessages([]);
  }, []);

  return {
    isRecording,
    startRecording,
    messages,
    clearMessages,
  };
}

function isRscChunkMessage(message: unknown): message is RscChunkMessage {
  return (message as RscChunkMessage).type === "RSC_CHUNK";
}

type StartRecordingMessage = {
  type: "START_RECORDING";
  tabId: number;
};

type ContentScriptUnloadedMessage = {
  type: "CONTENT_SCRIPT_UNLOADED";
  tabId: number;
};

function isContentScriptUnloadedMessage(
  message: unknown,
): message is ContentScriptUnloadedMessage {
  return (
    (message as ContentScriptUnloadedMessage).type === "CONTENT_SCRIPT_UNLOADED"
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
