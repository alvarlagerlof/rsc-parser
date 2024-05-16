import { RscChunkMessage } from "./types";

export function websocketPatcher({
  onRscChunkMessage,
}: {
  onRscChunkMessage: (message: RscChunkMessage) => void;
}) {
  var ws = window.WebSocket;

  window.WebSocket = function (a, b) {
    var that = b ? new ws(a, b) : new ws(a);
    //that.addEventListener("open", console.info.bind(console, "socket open"));
    //that.addEventListener("close", console.info.bind(console, "socket close"));
    that.addEventListener("message", (event) => {
      console.info("socket event", event);
      console.log("socket event data", event.data);

      const fetchStartTime = Date.now();
      const chunkStartTime = Date.now();
      const chunkEndTime = Date.now() + 10;

      let jsonString = JSON.stringify(event.data);
      jsonString = jsonString.slice(1, -1);
      jsonString = jsonString.replace(/\\/g, "");

      const chunkValue = Array.from(
        new TextEncoder().encode(`0:${jsonString}\n`),
      );

      onRscChunkMessage({
        type: "RSC_CHUNK",
        tabId: 0, // This may be overwritten extension code
        data: {
          // Server actions make POST requests to "", which is not a valid URL for new URL()
          fetchUrl: event.origin,
          fetchMethod: "WS",
          fetchStartTime,
          chunkValue,
          chunkStartTime,
          chunkEndTime,
        },
      });
    });
    return that;
  };

  window.WebSocket.prototype = ws.prototype;
}
