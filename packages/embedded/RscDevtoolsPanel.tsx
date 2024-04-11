"use client";

// @ts-expect-error Inline styles are not understood by the typescript compiler
import styles from "@rsc-parser/core/style.css?inline";
import {
  ViewerStreams,
  ViewerStreamsEmptyState,
  RscChunkMessage,
  BottomPanel,
  BottomPanelCloseButton,
  BottomPanelOpenButton,
  Logo,
  RecordButton,
  DebugCopyMessagesButton,
  ClearMessagesButton,
  PanelLayout,
} from "@rsc-parser/core";
import React, {
  ReactNode,
  startTransition,
  useCallback,
  useEffect,
  useState,
  useSyncExternalStore,
} from "react";

export function RscDevtoolsPanel() {
  const [isOpen, setIsOpen] = useState(false);

  const { isRecording, startRecording, messages, clearMessages } =
    useRscMessages();

  return (
    <ApplyStylingOnClient>
      <BottomPanel
        isOpen={isOpen}
        openButton={
          <BottomPanelOpenButton onClickOpen={() => setIsOpen(true)} />
        }
      >
        <PanelLayout
          header={
            <>
              <Logo variant="wide" />
              <RecordButton
                isRecording={isRecording}
                onClickRecord={startRecording}
              />
              {process.env.NODE_ENV === "development" ? (
                <DebugCopyMessagesButton messages={messages} />
              ) : null}
              {messages.length > 0 ? (
                <ClearMessagesButton onClickClearMessages={clearMessages} />
              ) : null}
            </>
          }
          closeButton={
            <BottomPanelCloseButton onClickClose={() => setIsOpen(false)} />
          }
        >
          {messages.length === 0 || !isRecording ? (
            <ViewerStreamsEmptyState />
          ) : (
            <ViewerStreams messages={messages} />
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

  if (!isClient) {
    return null;
  }

  return (
    <>
      <style>{styles}</style>
      {children}
    </>
  );
}

function useRscMessages() {
  const [messages, setMessages] = useState<RscChunkMessage[]>([]);
  const [isRecording, setIsRecording] = useState(false);

  useEffect(() => {
    if (!isRecording) {
      return;
    }

    // @ts-expect-error TODO: fix this
    if (typeof window.originalFetch === "undefined") {
      // @ts-expect-error TODO: fix this
      window.originalFetch = window.fetch;
    }

    window.fetch = async (...args) => {
      const fetchStartTime = Date.now();

      // @ts-expect-error TODO: fix this
      const response = await window.originalFetch(...args);

      if (typeof response.headers === "undefined") {
        return response;
      }

      if (!response.headers.has("Content-Type")) {
        return response;
      }

      if (response.headers.get("Content-Type") !== "text/x-component") {
        return response;
      }

      let url = undefined;
      let headers = undefined;
      if (args[0] instanceof Request) {
        url = args[0].url;
        if (typeof args[0].headers !== "undefined") {
          headers = args[0].headers;
        }
      } else if (typeof args[0] === "string" || args[0] instanceof URL) {
        url = args[0].toString();
        if (
          typeof args[1] !== "undefined" &&
          typeof args[1].headers !== "undefined"
        ) {
          headers = args[1].headers;
        }
      }

      if (!url || !headers) {
        return response;
      }

      const clonedResponse = response.clone();
      const reader = clonedResponse.body.getReader();

      // eslint-disable-next-line no-constant-condition
      while (true) {
        const chunkStartTime = Date.now();
        const { value, done } = await reader.read();
        if (done) {
          break;
        }
        const chunkEndTime = Date.now();

        // It's possible that this lookup will miss a duplicated message if another
        // one is being added at the same time. I haven't seen this happen in practice.
        if (
          messages.some((item) =>
            arraysEqual(item.data.chunkValue, Array.from(value)),
          )
        ) {
          return true;
        }

        const message = {
          type: "RSC_CHUNK",
          data: {
            fetchUrl: url,
            fetchHeaders:
              headers instanceof Headers
                ? Object.fromEntries(headers.entries())
                : headers,
            fetchStartTime,
            chunkValue: Array.from(value),
            chunkStartTime,
            chunkEndTime,
          },
        } as unknown as RscChunkMessage;

        startTransition(() => {
          setMessages((previous) => [...previous, message]);
        });
      }

      return response;
    };
  }, [isRecording]);

  const startRecording = useCallback(() => {
    setIsRecording(true);
  }, []);

  const clearMessages = useCallback(() => {
    setMessages([]);
  }, []);

  return { isRecording, startRecording, messages, clearMessages };
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
