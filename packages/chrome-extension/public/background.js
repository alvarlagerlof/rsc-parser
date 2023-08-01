browser.runtime.onMessageExternal.addListener(
  function handler(
    request,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _sender,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _sendResponse
  ) {
    console.log(request);
    _sendResponse({ received: true });
  }
);

browser.runtime.onMessage.addListener(
  function handler(
    request,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _sender,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _sendResponse
  ) {
    console.log(request);
    _sendResponse({ received: true });
  }
);
