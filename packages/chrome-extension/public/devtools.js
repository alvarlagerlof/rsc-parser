function handleShown() {
  //console.log("panel is being shown");
}

function handleHidden() {
  //console.log("panel is being hidden");
}

// eslint-disable-next-line no-undef
chrome.devtools.panels.create(
  "RSC Devtools",
  "",
  "./index.html",
  function (panel) {
    console.log("Hello! from panel create!");
    panel.onShown.addListener(handleShown);
    panel.onHidden.addListener(handleHidden);
  },
);
