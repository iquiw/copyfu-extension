import { describe, it, expect } from 'vitest';

import { isEmptyOutput, parseCopyOutput } from '../clipboard';

describe('isEmptyOutput', () => {
  it('should return true if html is defined and empty', () => {
    const tt = { html: '', plain: 'https://example.com', };
    expect(isEmptyOutput(tt)).toBeTruthy();
  });

  it('should return true if html is defined and spaces only', () => {
    const tt = { html: '  \n  ', plain: 'https://example.com', };
    expect(isEmptyOutput(tt)).toBeTruthy();
  });

  it('should return true if html is not defined and plain text is empty', () => {
    const tt = { plain: '', };
    expect(isEmptyOutput(tt)).toBeTruthy();
  });

  it('should return true if html is not defined and plain text is spaces only', () => {
    const tt = { plain: '  \n   \n ', };
    expect(isEmptyOutput(tt)).toBeTruthy();
  });

  it('should return false if html is not defined and plain text has contents', () => {
    const tt = { plain: '[Example](https://example.com)', };
    expect(isEmptyOutput(tt)).not.toBeTruthy();
  });

  it('should return false if html has contents', () => {
    const tt = { html: '<a href="https://example.com">Example</a>', plain: 'https://example.com', };
    expect(isEmptyOutput(tt)).not.toBeTruthy();
  });
});

describe('parseCopyOutput', () => {
  it('should parse plain text only', () => {
    const tt = parseCopyOutput('Hello, world', 'https://example.com');
    expect(tt.html).not.toBeDefined();
    expect(tt.plain).toBe('Hello, world');
  });

  it('should parse text with html marker', () => {
    const tt = parseCopyOutput('!copyfu:html\n<a href="https://example.com">Example</a>', 'https://example.com');
    expect(tt.html).toBe('<a href="https://example.com">Example</a>');
    expect(tt.plain).toBe('https://example.com');
  });

  it('should preserve newlines around text', () => {
    const tt = parseCopyOutput('!copyfu:html\n\n<a href="https://example.com">Example</a>\n', 'https://example.com');
    expect(tt.html).toBe('\n<a href="https://example.com">Example</a>\n');
    expect(tt.plain).toBe('https://example.com');
  });
});
