(function () {
  let optionIndex = 0;
  let coordinates = { coords: [] };
  if (!window.hasRun) {
    const overlay = document.createElement("div");
    setOverlayStyle(overlay);
    document.body.appendChild(overlay);
  }

  window.hasRun = true;

  function setOverlayStyle(overlay) {
    overlay.id = "coinFlipOverlay";
    overlay.style.zIndex = 999;
    overlay.style.position = "absolute";
    overlay.style.left = 0;
    overlay.style.top = 0;
    overlay.style.width = "100%";
    overlay.style.height = "100%";
    overlay.style.backgroundColor = "rgba(0, 0, 0, 0.8)";
    overlay.style.display = "none";
  }

  function getOverlay() {
    return document.getElementById("coinFlipOverlay");
  }

  function showOverlay() {
    getOverlay().style.display = "block";
  }

  function hideOverlay() {
    getOverlay().style.display = "none";
  }

  function resetValues() {
    optionIndex = 0;
    coordinates = { coords: [] };
  }

  /**
   * Returns two sets of coordinates to the extension
   */
  let trackCoordinates = (e) => {
    coordinates.coords[optionIndex] = {
      posX: e.clientX,
      posY: e.clientY,
      optionIndex: optionIndex,
    };

    document.title = e.clientX + " " + e.clientY;
    optionIndex++;

    if (optionIndex > 1) {
      document.removeEventListener("click", trackCoordinates);
      hideOverlay();
      return;
    }
  };

  browser.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.command === "flip") {
      document.title = "Succces";
      document.title = message.posX + " " + message.posY;
      console.log(message.posX + " " + message.posY);
      document.elementFromPoint(message.posX, message.posY).click();
    } else if (message.command === "select") {
      resetValues();
      showOverlay();
      getOverlay().addEventListener("click", trackCoordinates);
    } else if (message.command == "getCoordinates") {
      console.log("coordinate");
      sendResponse(coordinates);
      //sendResponse(coordinates);
    } else {
      console.error(`Unrecognised message: ${message}`);
    }
  });
})();
