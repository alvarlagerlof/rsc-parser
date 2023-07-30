import React, { useEffect, useState } from "react";

// @ts-ignore
import { StreamTabs, RscChunkMessage } from "@rsc-parser/core";
import "@rsc-parser/core/style.css";

export function App() {
  const [messages, setMessages] = useState<RscChunkMessage[]>([]);
  const [isRawRenderMode, setIsRawRenderMode] = useState(false);

  useEffect(() => {
    // @ts-ignore
    chrome.runtime.onMessage.addListener(function (
      request: unknown,
      _sender: unknown,
      _sendResponse: unknown
    ) {
      if (isRscChunkMessage(request)) {
        // if (request.data.fetchUrl !== tab.getState().activeId) {
        //   tab.setSelectedId(request.data.fetchUrl);
        // }

        setMessages((previous) => [...previous, request]);
      }
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
            className="w-full bg-slate-300 dark:bg-slate-700 dark:text-white p-2 rounded-lg"
            onClick={() => setMessages([])}
          >
            Clear
          </button>

          <div>
            <p className="mb-2 text-slate-700 dark:text-slate-300 italic">
              Settings
            </p>
            <label className="flex flex-row gap-1 items-center dark:text-white">
              <input
                type="checkbox"
                checked={isRawRenderMode}
                onChange={(event) => setIsRawRenderMode(event.target.checked)}
              />{" "}
              Show raw text
            </label>
          </div>

          <div>
            <p className="mb-2 text-slate-700 dark:text-slate-300  italic">
              Result
            </p>
            {isRawRenderMode ? (
              <ul className="divide divide-y">
                {filteredMessages.map((message) => (
                  <li
                    key={message.data.chunkStartTime}
                    className="py-4 first:pt-0 last:pb-0"
                  >
                    <pre className="break-all whitespace-break-spaces dark:text-white">
                      {JSON.stringify(message.data, null, 2)}
                    </pre>
                  </li>
                ))}
              </ul>
            ) : (
              <StreamTabs messages={filteredMessages} />
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function isRscChunkMessage(message: any): message is RscChunkMessage {
  return (message as RscChunkMessage).type === "RSC_CHUNK";
}
