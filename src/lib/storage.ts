import { storage } from '#imports';

const COPYFU_SERIALIZE_VERSION = '1';
const FORMAT_TEMPLATE_KEY = 'local:copyfu-template';

interface FormatTemplate {
  name: string;
  template: string;
}
export type { FormatTemplate };

const formatTemplates = storage.defineItem<FormatTemplate[]>(
  FORMAT_TEMPLATE_KEY,
  {
    fallback: [],
    version: 1,
  },
);

export async function loadTemplates() : Promise<FormatTemplate[]> {
  let ftempls = await formatTemplates.getValue();
  if (ftempls != null) {
    return ftempls;
  }
  return [];
}

export async function saveTemplates(ftempls: FormatTemplate[]) : Promise<void> {
  await formatTemplates.setValue(ftempls);
}

export function serialize(ftempls: FormatTemplate[] | null): string {
  let sanitized = [];
  if (ftempls != null) {
    // Skip if only one element exists with empty values.
    if (!(ftempls.length == 1 && ftempls[0].name == '' && ftempls[0].template == '')) {
      for (let ftempl of ftempls) {
        sanitized.push({
          name: ftempl.name,
          template: ftempl.template,
        });
      }
    }
  }
  return JSON.stringify({
    version: COPYFU_SERIALIZE_VERSION,
    templates: sanitized,
  });
}
