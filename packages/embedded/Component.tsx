"use client";

import "@rsc-parser/core/style.css";
import { ViewerStreams, RscChunkMessage } from "@rsc-parser/core";
import React, {
  ReactNode,
  startTransition,
  useEffect,
  useMemo,
  useState,
} from "react";

export function Component() {
  const [messages, setMessages] = useState<RscChunkMessage[]>([]);
  const [isRecording, setIsRecording] = useState(false);
  const tabId = useMemo(() => Date.now(), []);

  useEffect(() => {
    if (!isRecording) {
      return;
    }

    if (typeof window.originalFetch === "undefined") {
      window.originalFetch = window.fetch;
    }

    window.fetch = async (...args) => {
      const fetchStartTime = Date.now();

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

  return (
    <Panel>
      <div className="space-y-2 dark:text-white">
        {messages.length === 0 || !isRecording ? (
          <div className="flex flex-col gap-8">
            <div className="flex flex-row items-center justify-between">
              <h1 className="whitespace-nowrap text-sm">RSC Devtools</h1>

              {isRecording ? (
                <p className="py-0.5">Recording...</p>
              ) : (
                <button
                  className="rounded-md bg-slate-600 px-2 py-0.5 text-white dark:bg-slate-300 dark:text-black"
                  onClick={async () => {
                    setIsRecording(true);
                    // chrome.tabs.sendMessage(
                    //   chrome.devtools.inspectedWindow.tabId,
                    //   {
                    //     type: "START_RECORDING",
                    //     tabId: tabId,
                    //   } satisfies StartRecordingMessage,
                    // );
                  }}
                >
                  Start recording
                </button>
              )}
            </div>

            <p>
              {isRecording
                ? "Please navigate the page"
                : "Please start recording"}
            </p>
          </div>
        ) : (
          <div className="flex min-h-full flex-col gap-8">
            <div className="flex flex-row items-center justify-between">
              <h1 className="whitespace-nowrap text-sm">RSC Devtools</h1>
              {process.env.NODE_ENV === "development" ? (
                <button
                  onClick={() => {
                    const stingifiedMessages = JSON.stringify(messages);
                    console.log(stingifiedMessages);
                    const input = document.createElement("input");
                    // @ts-expect-error This is a hack
                    input.style =
                      "position: absolute; left: -1000px; top: -1000px";
                    input.value = stingifiedMessages;
                    document.body.appendChild(input);
                    input.select();
                    document.execCommand("copy");
                    document.body.removeChild(input);
                    alert("Copied messages to clipboard");
                  }}
                >
                  Copy messages array
                </button>
              ) : null}
              <button
                className="rounded-md bg-slate-600 px-2 py-0.5 text-white dark:bg-slate-300 dark:text-black"
                onClick={() => setMessages([])}
              >
                Clear
              </button>
            </div>

            <ViewerStreams messages={messages} />
          </div>
        )}
      </div>
    </Panel>
  );
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

function Panel({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <div
        style={{
          position: "fixed",
          bottom: 20,
          right: 20,
          zIndex: 1000,
          width: "40px",
          height: "40px",
          background: "lightblue",
          borderRadius: "50%",
        }}
        onClick={() => {
          setIsOpen(!isOpen);
        }}
      >
        button
      </div>
      {isOpen ? (
        <div
          style={{
            position: "fixed",
            bottom: 0,
            left: 0,
            width: "100vw",
            height: "30vh",
            zIndex: 1000,
            background: "rgb(227, 227, 227)",
            padding: "16px",
            overflowY: "scroll",
          }}
        >
          {children}
        </div>
      ) : null}
    </>
  );
}
