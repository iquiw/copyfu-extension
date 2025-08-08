export interface FormatTemplateForm {
  id: string,
  name: string,
  template: string,
  error: string | null,
}

export interface FormatTemplateFormResult {
  hasError: boolean,
  ftemplForms: FormatTemplateForm[],
}

export function validate(ftemplsForm: FormatTemplateForm[]): FormatTemplateFormResult {
  let hasError = false;
  let result = [];
  for (let ftemplForm of ftemplsForm) {
    let name = ftemplForm.name.trim();
    let template = ftemplForm.template;
    ftemplForm.error = null;
    if (name == '') {
      if (template == '') {
        // skip
        continue;
      } else {
        ftemplForm.error = 'Name';
        hasError = true;
      }
    } else if (template == '') {
      ftemplForm.error = 'Template';
      hasError = true;
    }
    result.push(ftemplForm);
  }
  return {
    hasError,
    ftemplForms: result,
  };
}
