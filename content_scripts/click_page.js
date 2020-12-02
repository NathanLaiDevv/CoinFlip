(function () {
  let optionIndex = 0;
  let coordinates = [];

  function resetValues() {
    optionIndex = 0;
    coordinates = [];
  }

  /**
   * Returns two sets of coordinates to the extension
   */
  let trackCoordinates = (e) => {
    if (optionIndex > 1) {
      document.removeEventListener("click", trackCoordinates);
      return;
    }
    coordinates[optionIndex] = {
      posX: e.clientX,
      posY: e.clientY,
      optionIndex: optionIndex,
    };
    console.log(`optionIndex: ${optionIndex}`);
    console.log(coordinates);
    document.title = e.clientX + " " + e.clientY;
    optionIndex++;
  };

  browser.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.command === "flip") {
      document.title = message.posX + " " + message.posY;
    } else if (message.command === "select") {
      resetValues();
      document.addEventListener("click", trackCoordinates);
    } else if (message.command == "getCoordinates") {
      console.log(coordinates);
      // console.log("GET COORDINATES " + coordinates[0] + coordinates[1]);
      sendResponse(coordinates);
    } else {
      console.error(`Unrecognised message: ${message}`);
    }
  });
})();
