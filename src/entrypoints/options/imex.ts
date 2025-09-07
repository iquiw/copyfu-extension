import { deserialize, serialize } from '@/lib/storage';
import type { FormatTemplate } from '@/lib/storage';

export function importTemplates(file: File,
  successCallback: (x: FormatTemplate[]) => void,
  errorCallback: (e: Error) => void)
{
  const reader = new FileReader();
  reader.onload = () => {
    try {
      successCallback(deserialize(reader.result as string)) ;
    } catch (e) {
      errorCallback(e as Error);
    }
  };
  reader.readAsText(file);
}

function generateExportFilename() {
  const datePart = new Date().toISOString().replaceAll(/[-:T]|\.\d+Z$/g, '');
  return `copyfu-${datePart}.json`;
}

export function exportTemplates(ftempls: FormatTemplate[] | null) {
  const data = serialize(ftempls);
  const url = URL.createObjectURL(new Blob([data]));
  const link = document.createElement('a');
  link.style.display = 'none';
  link.href = url;
  link.download = generateExportFilename();
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}
