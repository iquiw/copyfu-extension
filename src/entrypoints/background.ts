import { COMMAND_B2P_COPY_TEMPLATE, COMMAND_B2C_COPY_LINK, COMMAND_P2B_REFRESH_MENU, findTemplateIndex } from '@/lib/command';
import { isMenuItemEnabled } from '@/lib/format';
import { FormatTemplate, loadTemplates, saveTemplates } from '@/lib/storage';

async function popupAndCopy(index: number) {
  let doCopy = false;
  try {
    await (browser.action ?? browser.browserAction).openPopup();
    doCopy = true;
  } catch (e: any) {
    if (e.message == 'Could not find an active browser window.') {
      // This is the case when popup is already opened.
      // Is there better way to detect the case?
      doCopy = true;
    }
  }
  if (doCopy) {
    setTimeout(() => {
      browser.runtime.sendMessage({ action: COMMAND_B2P_COPY_TEMPLATE, index });
    }, 300);
  }
}

function updateContextMenus(ftempls: FormatTemplate[]) {
  browser.contextMenus.removeAll();
  browser.contextMenus.create({
    id: 'copyfu',
    title: 'CopyFU',
    contexts: ["link"],
  });
  let index = 0;
  for (const ftempl of ftempls) {
    index++;
    browser.contextMenus.create({
      id: `copy-template-${index}`,
      title: `${index}: ${ftempl.name}`,
      parentId: 'copyfu',
      contexts: ["link"],
      enabled: isMenuItemEnabled(ftempl.template),
    });
  }
}

const TemplatesPreset = [
  { name: 'Markdown', template: '[{{title}}]({{url}})' },
  { name: 'Org Mode', template: '[[{{url}}][{{title}}]]' },
  { name: 'AsciiDoc', template: '{{url}}[{{title}}]' },
  { name: 'Feed Link', template: '{{ feeds | first | map: "url" }}' },
];

async function copyLinkFromContextMenu(index: number, url: string, tabId: number) {
  const ftempls = await loadTemplates();
  if (index >= 0 && index < ftempls.length) {
    const ftempl = ftempls[index];
    try {
      await browser.tabs.sendMessage(tabId, {
        action: COMMAND_B2C_COPY_LINK,
        template: ftempl.template,
        url,
      });
    } catch (e) {
      console.warn(e);
    }
  }
}

export default defineBackground(() => {
  browser.commands.onCommand.addListener((command) => {
    const index = findTemplateIndex(command);
    if (index != null) {
      popupAndCopy(index);
    }
  });

  browser.runtime.onInstalled.addListener((details) => {
    loadTemplates().then((ftempls) => {
      if (ftempls.length == 0) {
        saveTemplates(TemplatesPreset);
      }
    });
  });

  browser.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action == COMMAND_P2B_REFRESH_MENU) {
      updateContextMenus(request.ftempls);
    }
  });

  browser.contextMenus.onClicked.addListener((info, tab) => {
    const url = info.linkUrl;
    if (url == null || tab == null || tab.id == null) {
      return;
    }
    const index = findTemplateIndex(info.menuItemId as string);
    if (index) {
      copyLinkFromContextMenu(index - 1, url, tab.id);
    }
  });

  loadTemplates().then((ftempls) => {
    if (ftempls.length == 0) {
      updateContextMenus(TemplatesPreset);
    } else {
      updateContextMenus(ftempls);
    }
  });
});
