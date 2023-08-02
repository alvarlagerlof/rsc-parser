if (typeof window.originalFetch === "undefined") {
  window.originalFetch = window.fetch;
}

window.fetch = async (...args) => {
  const fetchStartTime = Date.now();

  let url = undefined;
  let headers = undefined;
  if (args[0] instanceof Request) {
    url = args[0].url;
    headers = args[0].headers;
  } else if (typeof args[0] === "string" || args[0] instanceof URL) {
    url = args[0].toString();
    headers = args[1].headers;
  }

  const response = await window.originalFetch(...args);

  if (typeof headers === "undefined" || typeof headers === "undefined") {
    return response;
  }

  if (headers instanceof Headers && !headers.has("RSC")) {
    return response;
  }

  if (headers instanceof Object && typeof headers["RSC"] === "undefined") {
    return response;
  }

  const clonedResponse = response.clone();
  const reader = clonedResponse.body
    // eslint-disable-next-line no-undef
    .pipeThrough(new TextDecoderStream())
    .getReader();

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
