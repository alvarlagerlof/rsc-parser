import React, { useEffect, useState } from "react";

import { StreamViewer, RscChunkMessage } from "@rsc-parser/core";
import "@rsc-parser/core/style.css";

export function App() {
  const [messages, setMessages] = useState<RscChunkMessage[]>([]);

  useEffect(() => {
    chrome.runtime.onMessage.addListener(function handler(
      request: unknown,
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      _sender: unknown,
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      _sendResponse: unknown,
    ) {
      if (isRscChunkMessage(request)) {
        // if (request.data.fetchUrl !== tab.getState().activeId) {
        //   tab.setSelectedId(request.data.fetchUrl);
        // }

        setMessages((previous) => [...previous, request]);
      }

      return true;
    });
  }, []);

  const deduplicatedMessages = messages.reduce<RscChunkMessage[]>(
    (accumulator, current) => {
      if (
        !accumulator.find(
          (item) => item.data.chunkValue === current.data.chunkValue,
        )
      ) {
        accumulator.push(current);
      }
      return accumulator;
    },
    [] as RscChunkMessage[],
  );

  const sortedMessages = deduplicatedMessages.sort((a, b) => {
    return a.data.fetchStartTime - b.data.fetchStartTime;
  });

  const filteredMessages = sortedMessages.filter(
    (message) => !message.data.chunkValue.includes("DOCTYPE"),
  );

  console.log(filteredMessages);

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

          <StreamViewer messages={filteredMessages} />
        </div>
      )}
    </div>
  );
}

function isRscChunkMessage(message: unknown): message is RscChunkMessage {
  return (message as RscChunkMessage).type === "RSC_CHUNK";
}
