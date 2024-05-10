import { RscChunkMessage } from "./types";

function isRscResponse(response: Response): boolean {
  return response.headers.get("Content-Type") === "text/x-component";
}

function getFetchUrl(args: Parameters<typeof fetch>): string {
  if (args[0] instanceof Request) {
    return args[0].url;
  } else if (typeof args[0] === "string" || args[0] instanceof URL) {
    return args[0].toString();
  }

  throw new Error("Unknown fetch argument");
}

export function fetchPatcher({
  onRscChunkMessage,
}: {
  onRscChunkMessage: (message: RscChunkMessage) => void;
}) {
  // @ts-expect-error TODO: Fix type
  if (typeof window.originalFetch === "undefined") {
    // @ts-expect-error TODO: Fix type
    window.originalFetch = window.fetch;
  }

  window.fetch = async (...args) => {
    const fetchStartTime = Date.now();

    // @ts-expect-error TODO: Fix type
    const response = await window.originalFetch(...args);

    if (!isRscResponse(response)) {
      return response;
    }

    const url = getFetchUrl(args);

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

      onRscChunkMessage({
        type: "RSC_CHUNK",
        tabId: 0, // This may be overwritten extension code
        data: {
          fetchUrl: url,
          fetchStartTime,
          chunkValue: Array.from(value),
          chunkStartTime,
          chunkEndTime,
        },
      });
    }

    return response;
  };
}
