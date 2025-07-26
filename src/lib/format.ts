import { Liquid } from 'liquidjs';

const engine = new Liquid();

export interface FormatContext {
  url: string,
  title: string,
}

export function formatTemplate(template: string, context: FormatContext): any {
  const text = engine.parseAndRenderSync(template, {
    url: context.url,
    title: context.title,
  });
  return text;
}
