import { loadTemplates, saveTemplates } from "@/lib/storage";

function sendCopyMessage(index: number) {
  setTimeout(() => {
    browser.runtime.sendMessage({ action: 'copy-template', index });
  }, 300);
}

const CommandRegexp = new RegExp('copy-template-(\\d+)');

const TemplatesPreset = [
  { name: 'Markdown', template: '[{{title}}]({{url}})' },
  { name: 'Org Mode', template: '[[{{url}}][{{title}}]]' },
  { name: 'AsciiDoc', template: '{{url}}[{{title}}]' },
  { name: 'Feed Link', template: '{{ feeds | first | map: "url" }}' },
];

export default defineBackground(() => {
  browser.commands.onCommand.addListener((command) => {
    const match = CommandRegexp.exec(command);
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

  browser.runtime.onInstalled.addListener((details) => {
    loadTemplates().then((ftempls) => {
      if (ftempls.length == 0) {
        saveTemplates(TemplatesPreset);
      }
    });
  });
});
