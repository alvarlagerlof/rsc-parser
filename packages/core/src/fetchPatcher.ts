import { RscEvent } from "./events";

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
  onRscEvent,
}: {
  onRscEvent: (event: RscEvent) => void;
}) {
  // @ts-expect-error TODO: Fix type
  if (typeof window.originalFetch === "undefined") {
    // @ts-expect-error TODO: Fix type
    window.originalFetch = window.fetch;
  }

  window.fetch = async (...args) => {
    const fetchStartTime = Date.now();
    const requestId = String(fetchStartTime + Math.random()); // TODO: Use a better random number generator or uuid

    // @ts-expect-error TODO: Fix type
    const response: Response = await window.originalFetch(...args);

    if (!isRscResponse(response)) {
      return response;
    }

    onRscEvent({
      type: "RSC_REQUEST",
      data: {
        requestId,
        tabId: 0, // This may be overwritten extension code
        timestamp: fetchStartTime,
        // Server actions make POST requests to "", which is not a valid URL for new URL()
        url: convertLocalUrlToAbsolute(getFetchUrl(args)),
        method: getFetchMethod(args),
        headers: getFetchHeaders(args),
      },
    });

    onRscEvent({
      type: "RSC_RESPONSE",
      data: {
        requestId,
        tabId: 0, // This may be overwritten extension code
        timestamp: Date.now(),
        status: response.status,
        headers: headersInitToSerializableObject(response.headers),
      },
    });

    const clonedResponse = response.clone();
    if (!clonedResponse.body) {
      return response;
    }

    const reader = clonedResponse.body.getReader();

    while (true) {
      const { value, done } = await reader.read();
      if (done) {
        break;
      }

      onRscEvent({
        type: "RSC_CHUNK",
        data: {
          requestId,
          tabId: 0, // This may be overwritten extension code
          timestamp: Date.now(),
          chunkValue: Array.from(value),
        },
      });
    }

    return response;
  };
}
