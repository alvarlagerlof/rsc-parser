/**
 * injectScript - Inject internal script to available access to the `window`
 *
 * @param  {type} file_path Local path of the internal script.
 * @param  {type} tag The tag as string, where the script will be append (default: 'body').
 * @see    {@link http://stackoverflow.com/questions/20499994/access-window-variable-from-content-script}
 */
function injectScript(file_path, tag) {
  const node = document.getElementsByTagName(tag)[0];
  const script = document.createElement("script");
  script.setAttribute("type", "text/javascript");
  script.setAttribute("src", file_path);
  node.appendChild(script);
}

// eslint-disable-next-line no-undef
injectScript(chrome.runtime.getURL("fetch-patch.js"), "body");
window.addEventListener(
  "message",
  function (event) {
    // We only accept messages from this window to itself [i.e. not from any iframes]
    if (event.source != window) {
      return;
    }

    if (event.data.type && event.data.type == "RSC_CHUNK") {
      // eslint-disable-next-line no-undef
      chrome.runtime.sendMessage(event.data); // broadcasts it to rest of extension, or could just broadcast event.data.payload...
    } // else ignore messages seemingly not sent to yourself
  },
  false,
);
