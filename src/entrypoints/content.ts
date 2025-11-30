import { COMMAND_B2C_COPY_LINK, COMMAND_P2C_QUERY_FEED } from '@/lib/command';
import { formatTemplate } from '@/lib/format';
import type { Feed } from '@/lib/format';

const FEED_SELECTOR = 'link[rel="alternate"][type="application/rss+xml"],link[rel="alternate"][type="application/atom+xml"]';

function queryFeed(): Feed[]  {
  const links = document.querySelectorAll(FEED_SELECTOR);

  const feeds: Feed[] = [];
  for (const link of links) {
    const elem = link as HTMLLinkElement;
    feeds.push({
      url: elem.href,
      title: elem.title,
      type: elem.type === 'application/rss+xml' ? 'rss' : 'atom',
    });
  }
  return feeds;
}

function queryLinkText(): string | null {
  const element = document.activeElement;
  if (element && element.nodeName == 'A') {
    return element.textContent;
  }
  return null;
}

export default defineContentScript({
  matches: ['*://*/*'],
  main() {
    browser.runtime.onMessage.addListener((request, sender, sendMessage) => {
      if (request.action == COMMAND_P2C_QUERY_FEED) {
        const feeds = queryFeed();
        sendMessage({ feeds });
      } else if (request.action == COMMAND_B2C_COPY_LINK) {
        const template = request.template;
        const url = request.url;
        const linkText = queryLinkText();

        const text = formatTemplate(template, { url, title: linkText?? '', feeds: [] });
        if (text.trim().length > 0) {
          navigator.clipboard.writeText(text);
        }
      }
    });
  },
});
