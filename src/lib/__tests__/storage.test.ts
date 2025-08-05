import { describe, it, expect } from 'vitest';

import { serialize } from '../storage';

describe('serialize', () => {
  it('should serialize empty templates', async () => {
    let s = serialize([]);
    expect(s).toBe('{"version":"1","templates":[]}');
  });

  it('should serialize one template with empty values', async () => {
    let s = serialize([{ name: '', template: '' }]);
    expect(s).toBe('{"version":"1","templates":[]}');
  });

  it('should serialize one valid template', async () => {
    let s = serialize([{ name: 'Markdown', template: '[{{title}}]({{url}})' }]);
    expect(s).toBe('{"version":"1","templates":[{"name":"Markdown","template":"[{{title}}]({{url}})"}]}');
  });

  it('should serialize 2 valid templates and 1 empty template', async () => {
    let s = serialize([
      { name: 'Markdown', template: '[{{title}}]({{url}})' },
      { name: 'Org Mode', template: '[[{{url}}][{{title}}]]' },
      { name: '', template: '' },
    ]);
    expect(s).toBe('{"version":"1","templates":[{"name":"Markdown","template":"[{{title}}]({{url}})"},{"name":"Org Mode","template":"[[{{url}}][{{title}}]]"},{"name":"","template":""}]}');
  });
});
