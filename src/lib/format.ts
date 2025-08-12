import { Liquid } from 'liquidjs';

const engine = new Liquid();

export interface FormatContext {
  url: string,
  title: string,
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

export function formatTemplate(template: string, context: FormatContext): any {
  const text = engine.parseAndRenderSync(template, {
    url: context.url,
    title: context.title,
  });
  return text;
}
