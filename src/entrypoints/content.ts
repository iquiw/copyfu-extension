const FEED_SELECTOR = 'link[rel="alternate"][type="application/rss+xml"],link[rel="alternate"][type="application/atom+xml"]';

export default defineContentScript({
  matches: ['*://*/*'],
  main() {
    browser.runtime.onMessage.addListener((request, sender, sendMessage) => {
      if (request.type !== 'feed') {
        return;
      }
      const links = document.querySelectorAll(FEED_SELECTOR);

      const feeds = [];
      for (const link of links) {
        const elem = link as HTMLLinkElement;
        feeds.push({
          url: elem.href,
          title: elem.title,
        });
      }
      sendMessage({ feeds });
    });
  },
});
