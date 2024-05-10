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
  fetchPatcher,
  ReadNextScriptTagsButton,
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

  const {
    isRecording,
    startRecording,
    messages,
    clearMessages,
    readNextScriptTags,
  } = useRscMessages();

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
              <ReadNextScriptTagsButton
                onClickRead={() => {
                  readNextScriptTags();
                }}
              />
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

  const [polyfillIsLoaded, setPolyfillIsLoaded] = useState(false);

  useEffect(() => {
    if (!isClient) {
      return;
    }

    const script = document.createElement("script");
    script.type = "text/javascript";
    script.src = "https://unpkg.com/style-scoped@0/scoped.min.js";

    script.addEventListener("load", () => {
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

function useRscMessages() {
  const [messages, setMessages] = useState<RscChunkMessage[]>([]);
  const [isRecording, setIsRecording] = useState(false);

  useEffect(() => {
    if (!isRecording) {
      return;
    }

    fetchPatcher({
      onRscChunkMessage: (message) => {
        if (
          messages.some((item) =>
            arraysEqual(
              item.data.chunkValue,
              Array.from(message.data.chunkValue),
            ),
          )
        ) {
          return true;
        }

        startTransition(() => {
          setMessages((previous) => [...previous, message]);
        });
      },
    });
  }, [isRecording]);

  const startRecording = useCallback(() => {
    setIsRecording(true);
  }, []);

  const clearMessages = useCallback(() => {
    setMessages([]);
  }, []);

  const readNextScriptTags = useCallback(() => {
    try {
      // @ts-expect-error This is a hack
      const payload = self.__next_f.map((f) => f?.[1]).join("");

      console.log("TEST", payload);

      const messages = [
        {
          type: "RSC_CHUNK",
          tabId: 0,
          data: {
            fetchUrl: window.location.href,
            fetchMethod: "GET",
            fetchStartTime: 0,
            chunkStartTime: 0,
            chunkEndTime: 0,
            chunkValue: Array.from(new TextEncoder().encode(payload)),
          },
        } satisfies RscChunkMessage,
      ];

      setIsRecording(true);
      startTransition(() => {
        setMessages(() => messages);
      });
    } catch (error) {
      console.error(
        new Error("Error parsing Next.js payload", {
          cause: error,
        }),
      );
    }
  }, []);

  return {
    isRecording,
    startRecording,
    messages,
    clearMessages,
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
