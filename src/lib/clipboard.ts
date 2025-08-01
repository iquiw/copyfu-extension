import { browser } from 'wxt/browser';

import { formatTemplate } from './format';

export async function copyFormattedTemplate(template: string) {
  const tabs = await browser.tabs.query({
    active: true,
    currentWindow: true,
  });
  if (tabs.length > 0) {
    const tab = tabs[0];
    const text = await formatTemplate(template, {
      url: tab.url ?? '',
      title: tab.title ?? '',
    });
    console.log(text);
    navigator.clipboard.writeText(text);
  }
}
