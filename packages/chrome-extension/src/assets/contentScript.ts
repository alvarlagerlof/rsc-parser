import {
  type RscEvent,
  type StopRecordingEvent,
} from '@rsc-parser/core/events';
// import { RscEvent, isRscEvent } from "@rsc-parser/core/events";
// import {
//   StopRecordingEvent,
//   isStartRecordingEvent,
// } from "@rsc-parser/core/events";

// TODO: Find a way that these can be imported that makes them bundled
// into the output file without using ESM imports
function isStartRecordingEvent(event: unknown) {
  return (
    typeof event === 'object' &&
    event !== null &&
    'type' in event &&
    event.type === 'START_RECORDING'
  );
}
function isRscRequestEvent(event: unknown) {
  return (
    typeof event === 'object' &&
    event !== null &&
    'type' in event &&
    event.type === 'RSC_REQUEST'
  );
}
function isRscResponseEvent(event: unknown) {
  return (
    typeof event === 'object' &&
    event !== null &&
    'type' in event &&
    event.type === 'RSC_RESPONSE'
  );
}
function isRscChunkEvent(event: unknown) {
  return (
    typeof event === 'object' &&
    event !== null &&
    'type' in event &&
    event.type === 'RSC_CHUNK'
  );
}
export function isReadNextJsScriptTagsEvent(event: unknown) {
  return (
    typeof event === 'object' &&
    event !== null &&
    'type' in event &&
    event.type === 'READ_NEXT_JS_SCRIPT_TAGS'
  );
}
function isRscEvent(event: unknown) {
  return (
    isRscRequestEvent(event) ||
    isRscResponseEvent(event) ||
    isRscChunkEvent(event)
  );
}

/**
 * injectScript - Inject internal script to available access to the `window`
 *
 * @param  {type} file_path Local path of the internal script.
 * @param  {type} tag The tag as string, where the script will be append (default: 'body').
 * @see    {@link http://stackoverflow.com/questions/20499994/access-window-variable-from-content-script}
 */
function injectScript(file_path: string, tag: string) {
  const node = document.getElementsByTagName(tag)[0];
  const script = document.createElement('script');
  script.setAttribute('type', 'text/javascript');
  script.setAttribute('src', file_path);
  node.appendChild(script);
}

// This is used in the devtools panel to only accept messages from the current tab
let tabId: number | undefined = undefined;

// Only inject the fetch patch script when the START_RECORDING evebt
// is received from the devtools panel

chrome.runtime.onMessage.addListener(function (request) {
  if (isStartRecordingEvent(request)) {
    // Store the tabId so that the devtools panel can filter messages to
    // only show the ones from the current tab
    tabId = request.data.tabId;

    injectScript(
      chrome.runtime.getURL('assets/fetchPatcherInjector.js'),
      'body',
    );
  }

  if (isReadNextJsScriptTagsEvent(request)) {
    // Store the tabId so that the devtools panel can filter messages to
    // only show the ones from the current tab
    tabId = request.data.tabId;
    injectScript(
      chrome.runtime.getURL('assets/readNextJsScriptTagsInjector.js'),
      'body',
    );
  }

  return true;
});

// This code passes along events from fetchPatcherInjector
// and readNextJsScriptTagsInjector to the devtools panel
window.addEventListener(
  'message',
  function (event) {
    // We only accept events from this window to itself [i.e. not from any iframes]
    if (event.source != window) {
      return;
    }

    if (typeof tabId !== 'number') {
      return;
    }

    if (isRscEvent(event.data)) {
      const baseEvent = event.data;
      baseEvent.data.tabId = tabId;

      chrome.runtime.sendMessage(baseEvent satisfies RscEvent);
    }
  },
  false,
);

// When the content script is unloaded (like for a refresh), send a message to the devtools panel to stop recording
window.addEventListener('beforeunload', () => {
  if (!tabId) {
    return;
  }

  chrome.runtime.sendMessage({
    type: 'STOP_RECORDING',
    data: { tabId },
  } satisfies StopRecordingEvent);
});
