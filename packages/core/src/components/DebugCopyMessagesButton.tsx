import React from "react";

import { RscChunkMessage } from "../types";

export function DebugCopyMessagesButton({
  messages,
}: {
  messages: RscChunkMessage[];
}) {
  return (
    <button
      className="rounded-md bg-slate-600 px-2 py-0.5 text-white dark:bg-slate-300 dark:text-black"
      onClick={() => {
        const stingifiedMessages = JSON.stringify(messages);
        console.log(stingifiedMessages);
        const input = document.createElement("input");
        // @ts-expect-error This is a hack
        input.style = "position: absolute; left: -1000px; top: -1000px";
        input.value = stingifiedMessages;
        document.body.appendChild(input);
        input.select();
        document.execCommand("copy");
        document.body.removeChild(input);
        alert("Copied messages to clipboard");
      }}
    >
      (DEBUG) Copy messages
    </button>
  );
}
