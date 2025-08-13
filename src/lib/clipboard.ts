import { browser } from 'wxt/browser';

import { formatTemplate } from './format';

export enum FormatResult {
  Initial,
  Success,
  NoLink,
  Error,
}

export async function copyFormattedTemplate(template: string): Promise<FormatResult> {
  try {
    const tabs = await browser.tabs.query({
      active: true,
      lastFocusedWindow: true,
    });
    if (tabs.length > 0) {
      const tab = tabs[0];
      const text = formatTemplate(template, {
        url: tab.url ?? '',
        title: tab.title ?? '',
      });
      navigator.clipboard.writeText(text);

      return FormatResult.Success;
    } else {
      return FormatResult.NoLink;
    }
  } catch (e) {
    console.log(`Format Error: ${e}`);
    return FormatResult.Error;
  }
}
