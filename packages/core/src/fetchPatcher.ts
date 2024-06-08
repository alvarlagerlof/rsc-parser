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

function getFetchMethod(args: Parameters<typeof fetch>): "GET" | "POST" {
  function isGetOrPost(method: string): method is "GET" | "POST" {
    return method === "GET" || method === "POST";
  }

  if (args[0] instanceof Request && isGetOrPost(args[0].method)) {
    return args[0].method;
  } else if (typeof args[1]?.method === "undefined") {
    // Default to GET
    return "GET";
  } else if (args[1].method && isGetOrPost(args[1].method)) {
    return args[1].method;
  }

  throw new Error("Unknown fetch argument");
}

function headersInitToSerializableObject(
  headersInit: HeadersInit,
): Record<string, string> {
  const headers: Record<string, string> = {};

  if (headersInit instanceof Headers) {
    for (const entry of headersInit.entries()) {
      headers[entry[0]] = entry[1];
    }
    return headers;
  }

  for (const [key, value] of Object.entries(headersInit)) {
    headers[key] = value;
  }

  return headers;
}

function getFetchHeaders(
  args: Parameters<typeof fetch>,
): Record<string, string> {
  if (args[0] instanceof Request) {
    return headersInitToSerializableObject(args[0].headers);
  } else if (
    (typeof args[0] === "string" || args[0] instanceof URL) &&
    args[1] &&
    "headers" in args[1] &&
    args[1].headers
  ) {
    return headersInitToSerializableObject(args[1].headers);
  }

  throw new Error("Unknown fetch argument");
}

// For when the url is ""
function convertLocalUrlToAbsolute(url: string): string {
  if (url === "") {
    return window.location.href;
  }
  return url;
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
    const response: Response = await window.originalFetch(...args);

    if (!isRscResponse(response)) {
      return response;
    }

    const url = getFetchUrl(args);
    const requestMethod = getFetchMethod(args);
    const requestHeaders = getFetchHeaders(args);
    const responseHeaders = headersInitToSerializableObject(response.headers);

    console.log({ requestHeaders });
    console.log({ responseHeaders });

    const clonedResponse = response.clone();
    if (!clonedResponse.body) {
      return response;
    }

    const reader = clonedResponse.body.getReader();

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
          // Server actions make POST requests to "", which is not a valid URL for new URL()
          fetchUrl: convertLocalUrlToAbsolute(url),
          fetchMethod: requestMethod,
          fetchRequestHeaders: requestHeaders,
          fetchResponseStatus: response.status,
          fetchResponseHeaders: responseHeaders,
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
