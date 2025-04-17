import { Injectable } from '@angular/core';
import { createFormField, createFormGroup, FormFieldOptions } from 'ng-signal-forms';
import { FieldsetComponent, FormFieldComponent, FormFieldObject } from './form-components';

@Injectable({
  providedIn: 'root',
})
export class FormService {
  public createFormField<const C extends string>(
    field: Extract<Exclude<FormFieldComponent, FieldsetComponent>, { component: C }> & FormFieldOptions
  ) {
    const { value, disabled, hidden, readOnly, validators, ...element } = field;

    return {
      field: createFormField<(typeof field)['value']>(value as any, { disabled, hidden, readOnly, validators }),
      element: element as typeof element & { component: C },
    };
  }

  public createFormGroup<T extends Record<string, FormFieldObject>>(fields: T, options?: FormFieldOptions) {
    type FormGroupElements = { [K in keyof T]: T[K]['element'] };
    type FormGroupFields = { [K in keyof T]: T[K]['field'] };

    const { elements, formGroup } = Object.entries(fields).reduce(
      ({ elements, formGroup }, [key, { element, field }]) => ({
        formGroup: {
          ...formGroup,
          [key]: field,
        },
        elements: {
          ...elements,
          [key]: element,
        },
      }),
      {} as {
        elements: FormGroupElements;
        formGroup: FormGroupFields;
      }
    );

    return {
      field: createFormGroup(formGroup, options),
      element: {
        component: 'fieldset',
        children: elements,
      } satisfies FieldsetComponent,
    };
  }

  public createForm = this.createFormGroup;
}
