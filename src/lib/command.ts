export const COMMAND_MESSAGE_COPY_TEMPLATE = 'copy-template';
export const COMMAND_MESSAGE_QUERY_FEED = 'query-feed';

const CommandRegexp = new RegExp('copy-template-(\\d+)');

export function findTemplateIndex(command: string): number | null {
  const match = CommandRegexp.exec(command);
  if (match) {
    const index = parseInt(match[1], 10);
    return index;
  }
  return null;
}
