import { describe, it, expect } from 'vitest';

import { formatTemplate } from '../format';

const CONTEXT = {
  url: 'https://example.com',
  title: 'TITLE',
}

describe('formatTemplate', () => {
  it('should format bare text', async () => {
    const s = formatTemplate('Hello, world', CONTEXT);
    expect(s).toBe('Hello, world');
  });

  it('should format with URL and title', async () => {
    const s = formatTemplate('url={{url}},title={{title}}', CONTEXT);
    expect(s).toBe('url=https://example.com,title=TITLE');
  });

  it('should format with filter', async () => {
    const s = formatTemplate('url={{url | replace: "https:", "http:"}},title={{title | downcase}}', CONTEXT);
    expect(s).toBe('url=http://example.com,title=title');
  });
});

