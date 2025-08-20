import { browser } from 'wxt/browser';

import { areFeedsRequired, formatTemplate } from './format';
import type { Feed } from './format';

export enum FormatResult {
  Initial,
  Success,
  Empty,
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
      let feeds: Feed[] = [];
      const tab = tabs[0];
      if (tab.id && areFeedsRequired(template)) {
        const rsp = await browser.tabs.sendMessage(tab.id, { action: 'query-feed' });
        for (const feed of rsp.feeds) {
          feeds.push(feed);
        }
        if (feeds.length == 0) {
          return FormatResult.NoLink;
        }
      }
      const text = formatTemplate(template, {
        url: tab.url ?? '',
        title: tab.title ?? '',
        feeds,
      });
      if (text.trim().length == 0) {
        return FormatResult.Empty;
      }
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
