import { storage } from '#imports';

const COPYFU_SERIALIZE_VERSION = '2';
const FORMAT_TEMPLATE_KEY = 'local:copyfu-template';
const UUID_PATTERN = /^[0-9a-f]{8}-(?:[0-9a-f]{4}-){3}[0-9a-f]{12}$/i;

interface FormatTemplateV1 {
  name: string;
  template: string;
}

interface FormatTemplateV2 {
  id: string;
  name: string;
  urlPattern: string,
  template: string;
}

export type FormatTemplate = FormatTemplateV2;

const formatTemplates = storage.defineItem<FormatTemplateV2[]>(
  FORMAT_TEMPLATE_KEY,
  {
    fallback: [],
    version: 2,
    migrations: {
      2: (ftempls: FormatTemplateV1[]) => {
        return ftempls.map(migrate1to2);
      }
    },
  },
);

export function migrate1to2(ftemplv1: FormatTemplateV1): FormatTemplateV2 {
  return {
    id: crypto.randomUUID(),
    name: ftemplv1.name,
    urlPattern: '',
    template: ftemplv1.template,
  };
}

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
    if (!(ftempls.length == 1 && ftempls[0].name == '' && ftempls[0].urlPattern == '' && ftempls[0].template == '')) {
      for (const ftempl of ftempls) {
        sanitized.push({
          id: ftempl.id,
          name: ftempl.name,
          urlPattern: ftempl.urlPattern,
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
  if (rawData.version !== '1' && rawData.version !== '2') {
    throw new Error(`Unsupported version: ${rawData.version}`);
  }
  if (!rawData.templates) {
    throw new Error('Property "templates" missing');
  }
  for (const raw of rawData.templates) {
    if (raw.name == null) {
      throw new Error('Property "name" missing');
    }
    if (raw.template == null) {
      throw new Error('Property "template" missing');
    }
    let ftempl = null;
    if (rawData.version === '1') {
      ftempl = migrate1to2({
        name: raw.name,
        template: raw.template,
      });
    } else {
      if (raw.id == null) {
        throw new Error('Property "id" missing');
      }
      if (!UUID_PATTERN.test(raw.id)) {
        throw new Error('Property "id" invalid');
      }
      if (raw.urlPattern == null) {
        throw new Error('Property "urlPattern" missing');
      }
      try {
        new RegExp(raw.urlPattern);
      } catch {
        throw new Error('Property "urlPattern" invalid');
      }
      ftempl = {
        id: raw.id,
        name: raw.name,
        urlPattern: raw.urlPattern,
        template: raw.template,
      };
    }
    ftempls.push(ftempl);
  }
  return ftempls;
}
