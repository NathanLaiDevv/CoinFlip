/**
 * List for a click on the buttons on the popup,
 * send a message to the content script on the page
 */
function listenForClicks() {
  document.addEventListener("click", (e) => {
    function selectLocations(tabs) {
      browser.tabs.sendMessage(tabs[0].id, {
        command: "select",
      });
    }

    /**
     * Flip a coin (50/50) almost
     * then send the value to the content script
     */
    function flipCoin(tabs) {
      let randNum = Math.floor(Math.random() * 2);
      let coinSide = randNum == 0 ? "heads" : "tails";
      browser.tabs
        .sendMessage(tabs[0].id, {
          command: "getCoordinates",
        })
        .then((coordinates) => {
          browser.tabs.sendMessage(tabs[0].id, {
            command: "flip",
            posX: coordinates[coinSide].posX,
            posY: coordinates[coinSide].posY,
          });
        });
    }

    /**
     * Log the error into the console
     */
    function reportError(error) {
      console.error(`Coin Flip error: ${error}`);
    }

    /**
     * Get the current active tab
     * and call the appropriate button
     */
    if (e.target.classList.contains("flip")) {
      browser.tabs
        .query({ active: true, currentWindow: true })
        .then(flipCoin)
        .catch(reportError);
    } else if (e.target.classList.contains("select")) {
      browser.tabs
        .query({ active: true, currentWindow: true })
        .then(selectLocations)
        .catch(reportError);
    }
  });
}

// handleCoordinates(request, sender, sendResponse){
//   sendResponse({response: "KEKW"});
// }

// browser.runtime.onMessage.addListener(handleCoordinates);

function reportExecuteScriptError(error) {
  document.querySelector("#popup-content").classList.add("hidden");
  document.querySelector("#error-content").classList.remove("hidden");
  console.error(`Failed to execute coinFlip content script: ${error.message}`);
}

browser.tabs
  .executeScript({ file: "/content_scripts/click_page.js" })
  .then(listenForClicks)
  .catch(reportExecuteScriptError);
