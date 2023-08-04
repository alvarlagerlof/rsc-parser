if (typeof window.originalFetch === "undefined") {
  window.originalFetch = window.fetch;
}

window.fetch = async (...args) => {
  const fetchStartTime = Date.now();

  const response = await window.originalFetch(...args);

  if (typeof response.headers === "undefined") {
    return response;
  }

  if (!response.headers.has("Content-Type")) {
    return response;
  }

  if (response.headers.get("Content-Type") !== "text/x-component") {
    return response;
  }

  const clonedResponse = response.clone();
  const reader = clonedResponse.body
    // eslint-disable-next-line no-undef
    .pipeThrough(new TextDecoderStream())
    .getReader();

  let url = undefined;
  let headers = undefined;
  if (args[0] instanceof Request) {
    url = args[0].url;
    if (typeof args[0].headers !== "undefined") {
      headers = args[0].headers;
    }
  } else if (typeof args[0] === "string" || args[0] instanceof URL) {
    url = args[0].toString();
    if (
      typeof args[1] !== "undefined" &&
      typeof args[1].headers !== "undefined"
    ) {
      headers = args[1].headers;
    }
  }

  // eslint-disable-next-line no-constant-condition
  while (true) {
    const chunkStartTime = Date.now();
    const { value, done } = await reader.read();
    if (done) {
      break;
    }
    const chunkEndTime = Date.now();

    window.postMessage(
      {
        type: "RSC_CHUNK",
        data: {
          fetchUrl: url,
          fetchHeaders:
            headers instanceof Headers
              ? Object.fromEntries(headers.entries())
              : headers,
          fetchStartTime,
          chunkValue: value,
          chunkStartTime,
          chunkEndTime,
        },
      },
      "*",
    );
  }

  return response;
};
