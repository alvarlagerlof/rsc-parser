import { fetchPatcher } from "@rsc-parser/core/fetchPatcher";

fetchPatcher({
  onRscChunkMessage: (message) => {
    // Forward the message so that the content script can pick it up
    window.postMessage(message, "*");
  },
});
