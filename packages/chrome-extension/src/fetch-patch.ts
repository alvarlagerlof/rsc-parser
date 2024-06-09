import { fetchPatcher } from "@rsc-parser/core/fetchPatcher";

fetchPatcher({
  onRscEvent: (event) => {
    // Forward the message so that the content script can pick it up
    console.log("onRscEvent", event);
    window.postMessage(event, "*");
  },
});
