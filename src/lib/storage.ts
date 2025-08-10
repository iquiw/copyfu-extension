import { storage } from '#imports';

const COPYFU_SERIALIZE_VERSION = '1';
const FORMAT_TEMPLATE_KEY = 'local:copyfu-template';

export interface FormatTemplate {
  name: string;
  template: string;
}

const formatTemplates = storage.defineItem<FormatTemplate[]>(
  FORMAT_TEMPLATE_KEY,
  {
    fallback: [],
    version: 1,
  },
);

export async function loadTemplates() : Promise<FormatTemplate[]> {
  const ftempls = await formatTemplates.getValue();
  if (ftempls != null) {
    return ftempls;
  }
  return [];
}

function sanitize(ftempls: FormatTemplate[] | null): FormatTemplate[] {
  const sanitized = [];
  if (ftempls != null) {
    // Skip if only one element exists with empty values.
    if (!(ftempls.length == 1 && ftempls[0].name == '' && ftempls[0].template == '')) {
      for (const ftempl of ftempls) {
        sanitized.push({
          name: ftempl.name,
          template: ftempl.template,
        });
      }
    }
  }
  return sanitized;
}

export async function saveTemplates(ftempls: FormatTemplate[]) : Promise<FormatTemplate[]> {
  const ftemplsSave = sanitize(ftempls);
  await formatTemplates.setValue(ftemplsSave);
  return ftemplsSave;
}

export function serialize(ftempls: FormatTemplate[] | null): string {
  return JSON.stringify({
    version: COPYFU_SERIALIZE_VERSION,
    templates: sanitize(ftempls),
  });
}

export function deserialize(serialized: string): FormatTemplate[] {
  const ftempls: FormatTemplate[] = [];
  const rawData = JSON.parse(serialized);
  if (rawData.version !== '1') {
    throw new Error(`Unsupported version: ${rawData.version}`);
  }
  if (!rawData.templates) {
    throw new Error('Property "templates" missing');
  }
  for (const raw of rawData.templates) {
    if (raw.name == null) {
      throw new Error('Property "name" missing');
    }
    if (raw.name == null || raw.template == null) {
      throw new Error('Property "template" missing');
    }
    ftempls.push({
      name: raw.name,
      template: raw.template,
    });
  }
  return ftempls;
}
