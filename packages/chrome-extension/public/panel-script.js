// eslint-disable-next-line no-undef
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  const ul = document.querySelector("ul");
  const li = document.createElement("li");
  li.innerHTML = `<li><pre>${JSON.stringify(request, null, 2)}</pre></li>`;
  ul.prepend(li);
  sendResponse({
    received: true,
  });
});
