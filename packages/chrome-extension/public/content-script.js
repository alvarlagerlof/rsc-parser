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
injectScript(browser.runtime.getURL("fetch-patch.js"), "body");
window.addEventListener(
  "message",
  function (event) {
    // We only accept messages from this window to itself [i.e. not from any iframes]
    if (event.source != window) {
      return;
    }

    if (event.data.type && event.data.type == "RSC_CHUNK") {
      // eslint-disable-next-line no-undef
      console.log("send message", event.data);
      console.log(browser);
      browser.runtime.sendMessage(
        "84f1c0c9f0e0718ea92c2b4da93dce3d7790a5a1@temporary-addon",
        event.data
      ); // broadcasts it to rest of extension, or could just broadcast event.data.payload...
    } // else ignore messages seemingly not sent to yourself
  },
  false
);
