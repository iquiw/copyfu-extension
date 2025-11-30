export const COMMAND_B2P_COPY_TEMPLATE = 'copy-template';
export const COMMAND_B2C_COPY_LINK = 'copy-link';
export const COMMAND_P2C_QUERY_FEED = 'query-feed';
export const COMMAND_P2B_REFRESH_MENU = 'refresh-menu';

const CommandRegexp = new RegExp('copy-template-(\\d+)');

export function findTemplateIndex(command: string): number | null {
  const match = CommandRegexp.exec(command);
  if (match) {
    const index = parseInt(match[1], 10);
    return index;
  }
  return null;
}
