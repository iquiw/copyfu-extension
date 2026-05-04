import { browser } from 'wxt/browser';

import { areFeedsRequired, formatTemplate } from './format';
import type { Feed } from './format';
import { COMMAND_P2C_QUERY_FEED } from './command';

export enum FormatResult {
  Initial,
  Success,
  Empty,
  NoLink,
  Error,
}

interface TypedText {
  html?: string,
  plain: string,
}

export function isEmptyOutput(typedText: TypedText): boolean {
  // When html is defined, the template is in HTML mode.
  // In HTML mode, it's treated as empty even if plain (URL) is non-empty, because the HTML body is what matters.
  return ((typedText.html !== undefined && typedText.html.trim().length == 0)
    || typedText.plain.trim().length == 0);
}

export function parseCopyOutput(text: string, url: string): TypedText {
  const COPYFU_HTML_MARKER = '!copyfu:html\n';

  if (text.startsWith(COPYFU_HTML_MARKER)) {
    return {
      html: text.substring(COPYFU_HTML_MARKER.length),
      plain: url,
    };
  }
  return {
    plain: text,
  };
}

export async function writeClipboard(typedText: TypedText): Promise<void> {
  if (typedText.html) {
    const data = [new ClipboardItem({
      ['text/html']: new Blob([typedText.html], { type: 'text/html' }),
      ['text/plain']: new Blob([typedText.plain], { type: 'text/plain' }),
    })];

    await navigator.clipboard.write(data);
  } else {
    await navigator.clipboard.writeText(typedText.plain);
  }
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
        const rsp = await browser.tabs.sendMessage(tab.id, { action: COMMAND_P2C_QUERY_FEED });
        for (const feed of rsp.feeds) {
          feeds.push(feed);
        }
        if (feeds.length == 0) {
          return FormatResult.NoLink;
        }
      }
      const url = tab.url ?? '';
      const text = formatTemplate(template, {
        url: url,
        title: tab.title ?? '',
        feeds,
      });
      const typedText = parseCopyOutput(text, url);
      if (isEmptyOutput(typedText)) {
        return FormatResult.Empty;
      }
      await writeClipboard(typedText);

      return FormatResult.Success;
    } else {
      return FormatResult.NoLink;
    }
  } catch (e) {
    console.log(`Format Error: ${e}`);
    return FormatResult.Error;
  }
}
