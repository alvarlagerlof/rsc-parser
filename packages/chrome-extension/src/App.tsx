import React, { startTransition, useEffect, useState } from "react";

import { StreamViewer, RscChunkMessage } from "@rsc-parser/core";
import "@rsc-parser/core/style.css";

export function App() {
  const [messages, setMessages] = useState<RscChunkMessage[]>([]);
  const [isRecording, setIsRecording] = useState(false);

  useEffect(() => {
    function handleMessage(
      request: unknown,
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      _sender: unknown,
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      _sendResponse: unknown,
    ) {
      if (isContentScriptLoadedMessage(request)) {
        setIsRecording(false);
        setMessages([]);
      }

      if (!isRscChunkMessage(request)) {
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
    <div className="space-y-2">
      {messages.length === 0 || !isRecording ? (
        <div className="flex flex-col gap-8">
          <div className="flex flex-row items-center justify-between">
            <h1 className="whitespace-nowrap text-sm dark:text-white">
              RSC Devtools
            </h1>

            {isRecording ? (
              <p className="py-0.5 dark:text-white">Recording...</p>
            ) : (
              <button
                className="rounded-md bg-slate-600 px-2 py-0.5 text-white dark:bg-slate-300 dark:text-black"
                onClick={async () => {
                  setIsRecording(true);
                  chrome.tabs.sendMessage(
                    chrome.devtools.inspectedWindow.tabId,
                    {
                      type: "START_RECORDING",
                    } satisfies StartRecordingMessage,
                  );
                }}
              >
                Start recording
              </button>
            )}
          </div>

          <p className="dark:text-white">
            {isRecording
              ? "Please navigate the page"
              : "Please start recording"}
          </p>
        </div>
      ) : (
        <div className="flex min-h-full flex-col gap-8">
          <div className="flex flex-row items-center justify-between">
            <h1 className="whitespace-nowrap text-sm dark:text-white">
              RSC Devtools
            </h1>

            <button
              className="rounded-md bg-slate-600 px-2 py-0.5 text-white dark:bg-slate-300 dark:text-black"
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
};

type ContentScriptLoadedMessage = {
  type: "CONTENT_SCRIPT_LOADED";
};

function isContentScriptLoadedMessage(
  message: unknown,
): message is ContentScriptLoadedMessage {
  return (
    (message as ContentScriptLoadedMessage).type === "CONTENT_SCRIPT_LOADED"
  );
}
