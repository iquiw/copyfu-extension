import { Liquid } from 'liquidjs';

const engine = new Liquid();

export interface Feed {
  url: string,
  title: string,
  type: 'rss' | 'atom',
}

export interface FormatContext {
  url: string,
  title: string,
  feeds: Feed[],
}

engine.registerFilter('sub', (v, regexStr, replacement) => {
  const regex = new RegExp(regexStr);
  return v.replace(regex, replacement);
});

engine.registerFilter('gsub', (v, regexStr, replacement) => {
  const regex = new RegExp(regexStr, 'g');
  return v.replaceAll(regex, replacement);
});

engine.registerFilter('match', (v, regexStr) => {
  const regex = new RegExp(regexStr);
  return regex.test(v);
});

export function formatTemplate(template: string, context: FormatContext): string {
  const text = engine.parseAndRenderSync(template, {
    url: context.url,
    title: context.title,
    feeds: context.feeds,
  });
  return text as string;
}

export function areFeedsRequired(template: string): boolean {
  const vars = engine.globalVariablesSync(template);
  return vars.includes('feeds');
}
