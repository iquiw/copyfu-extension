import { browser } from 'wxt/browser';

import { formatTemplate } from './format';

export async function copyFormattedTemplate(template: string) {
  const tabs = await browser.tabs.query({
    active: true,
    lastFocusedWindow: true,
  });
  if (tabs.length > 0) {
    const tab = tabs[0];
    const text = await formatTemplate(template, {
      url: tab.url ?? '',
      title: tab.title ?? '',
    });
    navigator.clipboard.writeText(text);
  }
}
