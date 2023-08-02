import React, { useEffect, useState } from "react";

import { StreamTabs, RawStream, RscChunkMessage } from "@rsc-parser/core";
import "@rsc-parser/core/style.css";

export function App() {
  const [messages, setMessages] = useState<RscChunkMessage[]>([]);
  const [isRawRenderMode, setIsRawRenderMode] = useState(false);

  useEffect(() => {
    chrome.runtime.onMessage.addListener(function handler(
      request: unknown,
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      _sender: unknown,
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      _sendResponse: unknown
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
          (item) => item.data.chunkValue === current.data.chunkValue
        )
      ) {
        accumulator.push(current);
      }
      return accumulator;
    },
    [] as RscChunkMessage[]
  );

  const sortedMessages = deduplicatedMessages.sort((a, b) => {
    return a.data.fetchStartTime - b.data.fetchStartTime;
  });

  const filteredMessages = sortedMessages.filter(
    (message) => !message.data.chunkValue.includes("DOCTYPE")
  );

  return (
    <div className="space-y-2">
      {messages.length === 0 ? (
        <p className="dark:text-white">Please navigate once</p>
      ) : (
        <div className="flex flex-col gap-8">
          <button
            className="w-full rounded-lg bg-slate-300 p-2 dark:bg-slate-700 dark:text-white"
            onClick={() => setMessages([])}
          >
            Clear
          </button>

          <div>
            <p className="mb-2 italic text-slate-700 dark:text-slate-300">
              Settings
            </p>
            <label className="flex flex-row items-center gap-1 dark:text-white">
              <input
                type="checkbox"
                checked={isRawRenderMode}
                onChange={(event) => setIsRawRenderMode(event.target.checked)}
              />{" "}
              Show raw text
            </label>
          </div>

          <div>
            <p className="mb-2 italic text-slate-700  dark:text-slate-300">
              Result
            </p>
            {isRawRenderMode ? (
              <RawStream messages={filteredMessages} />
            ) : (
              <StreamTabs messages={filteredMessages} />
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function isRscChunkMessage(message: unknown): message is RscChunkMessage {
  return (message as RscChunkMessage).type === "RSC_CHUNK";
}
