export interface FormatTemplateForm {
  id: string,
  name: string,
  template: string,
  error: string | null,
}

export interface FormatTemplateFormResult {
  hasError: boolean,
  ftempls: FormatTemplateForm[],
}

export function validate(ftempls: FormatTemplateForm[]): FormatTemplateFormResult {
  let hasError = false;
  let result = [];
  for (let ftempl of ftempls) {
    let name = ftempl.name.trim();
    let template = ftempl.template;
    ftempl.error = null;
    if (name == '') {
      if (template == '') {
        // skip
        continue;
      } else {
        ftempl.error = 'Name';
        hasError = true;
      }
    } else if (template == '') {
      ftempl.error = 'Template';
      hasError = true;
    }
    result.push(ftempl);
  }
  return {
    hasError,
    ftempls: result,
  };
}
