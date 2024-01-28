import React, { startTransition, useEffect, useMemo, useState } from "react";

import { StreamViewer, RscChunkMessage } from "@rsc-parser/core";
import "@rsc-parser/core/style.css";

export function App() {
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
        messages.some(
          (item) => item.data.chunkValue === request.data.chunkValue,
        )
      ) {
        return true;
      }

      // TODO: This is a hack to prevent messages with HTML from being added
      // These messages should not be sent at all
      if (request.data.chunkValue.includes("DOCTYPE")) {
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

  return (
    <div className="space-y-2 dark:text-white">
      {messages.length === 0 || !isRecording ? (
        <div className="flex flex-col gap-8">
          <div className="flex flex-row items-center justify-between">
            <h1 className="whitespace-nowrap text-sm">RSC Devtools</h1>

            {isRecording ? (
              <p className="py-0.5">Recording...</p>
            ) : (
              <button
                className="rounded-md bg-slate-600 px-2 py-0.5 dark:bg-slate-300 dark:text-black"
                onClick={async () => {
                  setIsRecording(true);
                  chrome.tabs.sendMessage(
                    chrome.devtools.inspectedWindow.tabId,
                    {
                      type: "START_RECORDING",
                      tabId: tabId,
                    } satisfies StartRecordingMessage,
                  );
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
              className="rounded-md bg-slate-600 px-2 py-0.5 dark:bg-slate-300 dark:text-black"
              onClick={() => setMessages([])}
            >
              Clear
            </button>
          </div>

          <StreamViewer messages={messages} />
        </div>
      )}
    </div>
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
