const { fetch: originalFetch } = window;

window.fetch = async (...args) => {
  const fetchStartTime = Date.now();

  let [url, config] = args;
  const response = await originalFetch(url, config);

  if (config.headers["RSC"] !== "1") {
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

    console.log("post", {
      type: "RSC_CHUNK",
      data: {
        fetchUrl: url.toString(),
        fetchHeaders:
          config.headers instanceof Headers
            ? Object.fromEntries(config.headers.entries())
            : config.headers,
        fetchStartTime,
        chunkValue: value,
        chunkStartTime,
        chunkEndTime,
      },
    });

    window.postMessage(
      {
        type: "RSC_CHUNK",
        data: {
          fetchUrl: url.toString(),
          fetchHeaders:
            config.headers instanceof Headers
              ? Object.fromEntries(config.headers.entries())
              : config.headers,
          fetchStartTime,
          chunkValue: value,
          chunkStartTime,
          chunkEndTime,
        },
      },
      "*"
    );
  }

  return response;
};
