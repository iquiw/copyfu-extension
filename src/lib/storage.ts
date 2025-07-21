import { storage } from '#imports';

const FORMAT_TEMPLATE_KEY = 'local:copyfu-template';

interface FormatTemplate {
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
  let ftempls = await formatTemplates.getValue();
  if (ftempls != null) {
    return ftempls;
  }
  return [];
}

export async function saveTemplates(ftempls: FormatTemplate[]) : Promise<void> {
  await formatTemplates.setValue(ftempls);
}
