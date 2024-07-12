import { readNextJsScriptTags } from '@rsc-parser/core/readNextJsScriptTags';

(() => {
  const events = readNextJsScriptTags();

  if (events) {
    for (const event of events) {
      window.postMessage(event, '*');
    }
  }
})();
