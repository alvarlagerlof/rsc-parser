function handleShown() {
  //console.log("panel is being shown");
}

function handleHidden() {
  //console.log("panel is being hidden");
}

chrome.devtools.panels.create(
  "RSC Devtools",
  "",
  "./devtoolsPanel.html",
  function (panel) {
    // console.log("Hello! from panel create");
    panel.onShown.addListener(handleShown);
    panel.onHidden.addListener(handleHidden);
  },
);
