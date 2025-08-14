import { describe, it, expect } from 'vitest';

import { formatTemplate } from '../format';

const CONTEXT1 = {
  url: 'https://example.com',
  title: 'TITLE',
  feeds: [{ url: "https://example.com/feed", title: "RSS Feed" }],
}

const CONTEXT2 = {
  url: 'https://github.com/sveltejs/svelte/',
  title: 'GitHub - sveltejs/svelte: web development for the rest of us',
  feeds: [{ url: "https://example.com/feed", title: "RSS Feed" }, { url: "https://example.com/atom", title: "Atom Feed" }],
}

const CONTEXT3 = {
  url: 'https://www.amazon.co.jp/%E3%80%90Amazon-co-jp-%E9%99%90%E5%AE%9A%E3%80%91Kensington-K72084JP-Bluetooth%E3%83%BB2-4GHz%E3%83%AF%E3%82%A4%E3%83%A4%E3%83%AC%E3%82%B9%E3%83%BB%E6%9C%89%E7%B7%9A%E6%8E%A5%E7%B6%9A%E5%AF%BE%E5%BF%9C-%E5%86%8D%E7%94%9F%E3%83%97%E3%83%A9%E3%82%B9%E3%83%81%E3%83%83%E3%82%AF%E4%BD%BF%E7%94%A8/dp/B0DM5BJFLR/ref=sr_1_4?dib_tag=se&qid=1754959361&refinements=p_123%3A314147&rnid=23341432051&s=computers&sr=1-4&th=1',
  title: 'Amazon.co.jp: 【Amazon.co.jp 限定】Kensington ケンジントン SlimBlade Pro EQトラックボール ホワイト K72084JP Bluetooth・2.4GHzワイヤレス・有線接続対応 再生プラスチック使用 : パソコン・周辺機器',
  feeds: [],
}

describe('formatTemplate', () => {
  it('should format bare text', async () => {
    const s = formatTemplate('Hello, world', CONTEXT1);
    expect(s).toBe('Hello, world');
  });

  it('should format with URL and title', async () => {
    const s = formatTemplate('url={{url}},title={{title}}', CONTEXT1);
    expect(s).toBe('url=https://example.com,title=TITLE');
  });

  it('should format with builtin filter', async () => {
    const s = formatTemplate('url={{url | replace: "https:", "http:"}},title={{title | downcase}}', CONTEXT1);
    expect(s).toBe('url=http://example.com,title=title');
  });

  it('should format with custom filters', async () => {
    const s = formatTemplate('url={{url | sub: "/$", ".git"}},title={{title | sub: ":.*$", "" | gsub: " ", "_"}}', CONTEXT2);
    expect(s).toBe('url=https://github.com/sveltejs/svelte.git,title=GitHub_-_sveltejs/svelte');
  });

  it('should format with custom filters and builting tags', async () => {
    const template = `
{%- assign is_amazon = url | match: "https://[^/]*amazon.(?:com|co\.[a-z]{2})/" -%}
{%- if is_amazon -%}
{%- assign url = url | sub: "(https://[^/]+).*(/dp/[^/?]+).*", "$1$2" -%}
{%- assign title = title | sub: "^[^:]*: ", "" | sub: " :.*$", "" -%}
{%- endif -%}
[{{title}}]({{url}})`;
    const s1 = formatTemplate(template, CONTEXT3);
    expect(s1).toBe('[【Amazon.co.jp 限定】Kensington ケンジントン SlimBlade Pro EQトラックボール ホワイト K72084JP Bluetooth・2.4GHzワイヤレス・有線接続対応 再生プラスチック使用](https://www.amazon.co.jp/dp/B0DM5BJFLR)');

    const s2 = formatTemplate(template, CONTEXT1);
    expect(s2).toBe('[TITLE](https://example.com)');
  });

  it('should format with one feed', async () => {
    const s = formatTemplate('{{ feeds | map: "url" | first }}', CONTEXT1);
    expect(s).toBe('https://example.com/feed');
  });

  it('should format with Atom feed', async () => {
    const s = formatTemplate(`
{%- assign feed = feeds | find_exp: "item", "item.title contains 'Atom'" -%}
{{ feed.url }}`, CONTEXT2);
    expect(s).toBe('https://example.com/atom');
  });
});

