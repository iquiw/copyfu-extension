import { describe, it, expect } from 'vitest';

import { deserialize, serialize } from '../storage';

describe('serialize', () => {
  it('should serialize empty templates', async () => {
    const s = serialize([]);
    expect(s).toBe('{"version":"2","templates":[]}');
  });

  it('should serialize one template with empty values', async () => {
    const s = serialize([{ id: '55c20d49-9f6e-4423-a4c1-d5a22ec9f26c', name: '', urlPattern: '', template: '' }]);
    expect(s).toBe('{"version":"2","templates":[]}');
  });

  it('should serialize one valid template', async () => {
    const s = serialize([{ id: '55c20d49-9f6e-4423-a4c1-d5a22ec9f26c', name: 'Markdown', urlPattern: 'https://example.com', template: '[{{title}}]({{url}})' }]);
    expect(s).toBe('{"version":"2","templates":[{"id":"55c20d49-9f6e-4423-a4c1-d5a22ec9f26c","name":"Markdown","urlPattern":"https://example.com","template":"[{{title}}]({{url}})"}]}');
  });

  it('should serialize 2 valid templates and 1 empty template', async () => {
    const s = serialize([
      { id: '55c20d49-9f6e-4423-a4c1-d5a22ec9f26c', name: 'Markdown', urlPattern: 'https://example.com', template: '[{{title}}]({{url}})' },
      { id: 'd50044d0-cf8c-4796-809d-fe477e500ff2', name: 'Org Mode', urlPattern: '', template: '[[{{url}}][{{title}}]]' },
      { id: 'c7e3f7c3-e68c-4d14-aac1-d84b7ab8049f', name: '', urlPattern: '', template: '' },
    ]);
    expect(s).toBe('{"version":"2","templates":[{"id":"55c20d49-9f6e-4423-a4c1-d5a22ec9f26c","name":"Markdown","urlPattern":"https://example.com","template":"[{{title}}]({{url}})"},{"id":"d50044d0-cf8c-4796-809d-fe477e500ff2","name":"Org Mode","urlPattern":"","template":"[[{{url}}][{{title}}]]"},{"id":"c7e3f7c3-e68c-4d14-aac1-d84b7ab8049f","name":"","urlPattern":"","template":""}]}');
  });
});

describe('deserialize v1', () => {
  it('should deserialize empty templates', async () => {
    const ftempls = deserialize('{"version":"1","templates":[]}');
    expect(ftempls).toEqual([]);
  });

  it('should deserialize one template', async () => {
    const ftempls = deserialize('{"version":"1","templates":[{"name":"Markdown","template":"[{{title}}]({{url}})"}]}');
    expect(ftempls).toHaveLength(1);
    expect(ftempls[0].id).toBeDefined();
    expect(ftempls[0].name).toBe('Markdown');
    expect(ftempls[0].urlPattern).toBe('');
    expect(ftempls[0].template).toBe('[{{title}}]({{url}})');
  });

  it('should deserialize 2 templates', async () => {
    const ftempls = deserialize('{"version":"1","templates":[{"name":"Markdown","template":"[{{title}}]({{url}})"},{"name":"Org Mode","template":"[[{{url}}][{{title}}]]"}]}');
    expect(ftempls).toHaveLength(2);
    expect(ftempls[0].id).toBeDefined();
    expect(ftempls[0].name).toBe('Markdown');
    expect(ftempls[0].urlPattern).toBe('');
    expect(ftempls[0].template).toBe('[{{title}}]({{url}})');
    expect(ftempls[1].id).toBeDefined();
    expect(ftempls[1].name).toBe('Org Mode');
    expect(ftempls[1].urlPattern).toBe('');
    expect(ftempls[1].template).toBe('[[{{url}}][{{title}}]]');
  });

  it('should ignore unknown properties', async () => {
    const ftempls = deserialize('{"version":"1","templates":[{"name":"Markdown","template":"[{{title}}]({{url}})","unknown":"foo"}],"unknown":"3"}');
    expect(ftempls).toHaveLength(1);
    expect(ftempls[0].id).toBeDefined();
    expect(ftempls[0].name).toBe('Markdown');
    expect(ftempls[0].urlPattern).toBe('');
    expect(ftempls[0].template).toBe('[{{title}}]({{url}})');
  });
});

describe('deserialize error v1', () => {
  it('should throw error if version is missing', async () => {
    expect(() => deserialize('{"templates":[]}')).toThrow('Unsupported version: undefined');
  });

  it('should throw error if version is neither 1 nor 2', async () => {
    expect(() => deserialize('{"version":"3","templates":[]}')).toThrow('Unsupported version: 3');
  });

  it('should throw error if templates is missing', async () => {
    expect(() => deserialize('{"version":"1"}')).toThrow('Property "templates" missing');
  });

  it('should throw error if name is missing', async () => {
    expect(() => deserialize('{"version":"1","templates":[{"template":"[{{title}}]({{url}})"}]}')).toThrow('Property "name" missing');
  });

  it('should throw error if template is missing', async () => {
    expect(() => deserialize('{"version":"1","templates":[{"name":"Markdown"}]}')).toThrow('Property "template" missing');
  });
});

describe('deserialize v2', () => {
  it('should deserialize empty templates', async () => {
    const ftempls = deserialize('{"version":"2","templates":[]}');
    expect(ftempls).toEqual([]);
  });

  it('should deserialize one template', async () => {
    const ftempls = deserialize('{"version":"2","templates":[{"id":"55c20d49-9f6e-4423-a4c1-d5a22ec9f26c","name":"Markdown","urlPattern":"https://example.com","template":"[{{title}}]({{url}})"}]}');
    expect(ftempls).toHaveLength(1);
    expect(ftempls[0].id).toBe('55c20d49-9f6e-4423-a4c1-d5a22ec9f26c');
    expect(ftempls[0].name).toBe('Markdown');
    expect(ftempls[0].urlPattern).toBe('https://example.com');
    expect(ftempls[0].template).toBe('[{{title}}]({{url}})');
  });

  it('should deserialize 2 templates', async () => {
    const ftempls = deserialize('{"version":"2","templates":[{"id":"55c20d49-9f6e-4423-a4c1-d5a22ec9f26c","name":"Markdown","urlPattern":"https://example.com","template":"[{{title}}]({{url}})"},{"id":"d50044d0-cf8c-4796-809d-fe477e500ff2","name":"Org Mode","urlPattern":"","template":"[[{{url}}][{{title}}]]"}]}');
    expect(ftempls).toHaveLength(2);
    expect(ftempls[0].id).toBe('55c20d49-9f6e-4423-a4c1-d5a22ec9f26c');
    expect(ftempls[0].name).toBe('Markdown');
    expect(ftempls[0].urlPattern).toBe('https://example.com');
    expect(ftempls[0].template).toBe('[{{title}}]({{url}})');
    expect(ftempls[1].id).toBe('d50044d0-cf8c-4796-809d-fe477e500ff2');
    expect(ftempls[1].name).toBe('Org Mode');
    expect(ftempls[1].urlPattern).toBe('');
    expect(ftempls[1].template).toBe('[[{{url}}][{{title}}]]');
  });
});

describe('deserialize error v2', () => {
  it('should throw error if templates is missing', async () => {
    expect(() => deserialize('{"version":"2"}')).toThrow('Property "templates" missing');
  });

  it('should throw error if name is missing', async () => {
    expect(() => deserialize('{"version":"2","templates":[{"template":"[{{title}}]({{url}})"}]}')).toThrow('Property "name" missing');
  });

  it('should throw error if template is missing', async () => {
    expect(() => deserialize('{"version":"2","templates":[{"name":"Markdown"}]}')).toThrow('Property "template" missing');
  });

  it('should throw error if id is missing', async () => {
    expect(() => deserialize('{"version":"2","templates":[{"name":"Markdown","template":"[{{title}}]({{url}})"}]}')).toThrow('Property "id" missing');
  });

  it('should throw error if urlPattern is missing', async () => {
    expect(() => deserialize('{"version":"2","templates":[{"id":"55c20d49-9f6e-4423-a4c1-d5a22ec9f26c","name":"Markdown","template":"[{{title}}]({{url}})"}]}')).toThrow('Property "urlPattern" missing');
  });

  it('should throw error if id is invalid UUID', async () => {
    expect(() => deserialize('{"version":"2","templates":[{"id":"55c20d49-9f6e-4423-a4c1d5a22ec9f26c","name":"Markdown","urlPattern":"","template":"[{{title}}]({{url}})"}]}')).toThrow('Property "id" invalid');
  });

  it('should throw error if urlPattern is invalid RegExp', async () => {
    expect(() => deserialize('{"version":"2","templates":[{"id":"55c20d49-9f6e-4423-a4c1-d5a22ec9f26c","name":"Markdown","urlPattern":"a[","template":"[{{title}}]({{url}})"}]}')).toThrow('Property "urlPattern" invalid');
  });

});
