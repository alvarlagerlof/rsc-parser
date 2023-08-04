import React, { startTransition, useEffect, useState } from "react";

import { StreamViewer, RscChunkMessage } from "@rsc-parser/core";
import "@rsc-parser/core/style.css";

export function App() {
  const [messages, setMessages] = useState<RscChunkMessage[]>([]);

  useEffect(() => {
    function addMessage(
      request: unknown,
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      _sender: unknown,
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      _sendResponse: unknown,
    ) {
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

    chrome.runtime.onMessage.addListener(addMessage);

    return () => {
      chrome.runtime.onMessage.removeListener(addMessage);
    };
  }, []);

  return (
    <div className="space-y-2">
      {messages.length === 0 ? (
        <div className="flex flex-col gap-8">
          <h1 className="whitespace-nowrap text-sm dark:text-white">
            RSC Devtools
          </h1>
          <p className="dark:text-white">Please navigate once</p>
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
