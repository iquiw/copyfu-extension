import { describe, it, expect } from 'vitest';

import { deserialize, serialize } from '../storage';

describe('serialize', () => {
  it('should serialize empty templates', async () => {
    const s = serialize([]);
    expect(s).toBe('{"version":"1","templates":[]}');
  });

  it('should serialize one template with empty values', async () => {
    const s = serialize([{ name: '', template: '' }]);
    expect(s).toBe('{"version":"1","templates":[]}');
  });

  it('should serialize one valid template', async () => {
    const s = serialize([{ name: 'Markdown', template: '[{{title}}]({{url}})' }]);
    expect(s).toBe('{"version":"1","templates":[{"name":"Markdown","template":"[{{title}}]({{url}})"}]}');
  });

  it('should serialize 2 valid templates and 1 empty template', async () => {
    const s = serialize([
      { name: 'Markdown', template: '[{{title}}]({{url}})' },
      { name: 'Org Mode', template: '[[{{url}}][{{title}}]]' },
      { name: '', template: '' },
    ]);
    expect(s).toBe('{"version":"1","templates":[{"name":"Markdown","template":"[{{title}}]({{url}})"},{"name":"Org Mode","template":"[[{{url}}][{{title}}]]"},{"name":"","template":""}]}');
  });
});

describe('deserialize', () => {
  it('should deserialize empty templates', async () => {
    const ftempls = deserialize('{"version":"1","templates":[]}');
    expect(ftempls).toEqual([]);
  });

  it('should deserialize one template', async () => {
    const ftempls = deserialize('{"version":"1","templates":[{"name":"Markdown","template":"[{{title}}]({{url}})"}]}');
    expect(ftempls).toEqual([{ name: 'Markdown', template: '[{{title}}]({{url}})' }]);
  });

  it('should deserialize 2 templates', async () => {
    const ftempls = deserialize('{"version":"1","templates":[{"name":"Markdown","template":"[{{title}}]({{url}})"},{"name":"Org Mode","template":"[[{{url}}][{{title}}]]"}]}');
    expect(ftempls).toEqual([
      { name: 'Markdown', template: '[{{title}}]({{url}})' },
      { name: 'Org Mode', template: '[[{{url}}][{{title}}]]' },
    ]);
  });

  it('should ignore unknown properties', async () => {
    const ftempls = deserialize('{"version":"1","templates":[{"name":"Markdown","template":"[{{title}}]({{url}})","unknown":"foo"}],"unknown":"3"}');
    expect(ftempls).toEqual([
      { name: 'Markdown', template: '[{{title}}]({{url}})' },
    ]);
  });
});

describe('deserialize error', () => {
  it('should throw error if version is missing', async () => {
    expect(() => deserialize('{"templates":[]}')).toThrowError('Unsupported version: undefined');
  });

  it('should throw error if version is not 1', async () => {
    expect(() => deserialize('{"version":"2","templates":[]}')).toThrowError('Unsupported version: 2');
  });

  it('should throw error if templates is missing', async () => {
    expect(() => deserialize('{"version":"1"}')).toThrowError('Property "templates" missing');
  });

  it('should throw error if template.name is missing', async () => {
    expect(() => deserialize('{"version":"1","templates":[{"template":"[{{title}}]({{url}})"}]}')).toThrowError('Property "name" missing');
  });

  it('should throw error if template.name is missing', async () => {
    expect(() => deserialize('{"version":"1","templates":[{"name":"Markdown"}]}')).toThrowError('Property "template" missing');
  });
});
