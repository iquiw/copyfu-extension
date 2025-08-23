function sendCopyMessage(index: number) {
  setTimeout(() => {
    browser.runtime.sendMessage({ action: 'copy-template', index });
  }, 300);
}

const commandRegexp = new RegExp('copy-template-(\\d+)');

export default defineBackground(() => {
  browser.commands.onCommand.addListener((command) => {
    const match = commandRegexp.exec(command);
    if (match) {
      const index = parseInt(match[1], 10);
      (browser.action ?? browser.browserAction).openPopup().then(() => {
        sendCopyMessage(index);
      }).catch((e) => {
        if (e.message == 'Could not find an active browser window.') {
          // This is the case when popup is already opened.
          // Is there better way to detect the case?
          sendCopyMessage(index);
        } else {
          console.log(e);
        }
      });
    }
  });
});
