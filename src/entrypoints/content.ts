import { COMMAND_MESSAGE_QUERY_FEED } from '@/lib/command';

const FEED_SELECTOR = 'link[rel="alternate"][type="application/rss+xml"],link[rel="alternate"][type="application/atom+xml"]';

export default defineContentScript({
  matches: ['*://*/*'],
  main() {
    browser.runtime.onMessage.addListener((request, sender, sendMessage) => {
      if (request.action !== COMMAND_MESSAGE_QUERY_FEED) {
        return;
      }
      const links = document.querySelectorAll(FEED_SELECTOR);

      const feeds = [];
      for (const link of links) {
        const elem = link as HTMLLinkElement;
        feeds.push({
          url: elem.href,
          title: elem.title,
          type: elem.type === 'application/rss+xml' ? 'rss' : 'atom',
        });
      }
      sendMessage({ feeds });
    });
  },
});
