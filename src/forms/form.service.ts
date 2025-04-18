import { Injectable } from '@angular/core';
import { createFormField, createFormGroup, FormFieldOptions, FormGroup, FormGroupOptions } from 'ng-signal-forms';
import {
  FieldsetComponent,
  FormComponent,
  FormFieldComponent,
  FormFieldObject,
  FormGroupObject,
  FormObject,
} from './form-components';

@Injectable({
  providedIn: 'root',
})
export class FormService {
  public createFormField<const C extends string>(
    field: Extract<FormFieldComponent, { component: C }> & FormFieldOptions
  ) {
    const { disabled, hidden, readOnly, validators, ...element } = field;

    return {
      field: createFormField<(typeof field)['value']>(element.value as any, { disabled, hidden, readOnly, validators }),
      element: element as typeof element & { component: C } & { value: (typeof field)['value'] },
    };
  }

  public createFormGroup<T extends Record<string, FormObject>>(
    fields: T,
    options?: FormGroupOptions & { label?: string }
  ) {
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
        label: options?.label,
      } satisfies FieldsetComponent,
    };
  }

  public createForm<T extends Record<string, FormObject>>({
    fields,
    options,
    submit,
  }: {
    fields: T;
    submit: {
      label: string;
      onsubmit: (form: ReturnType<FormGroup<{ [K in keyof T]: T[K]['field'] }>['value']>) => void;
    };
    options?: FormGroupOptions;
  }) {
    const { field, element } = this.createFormGroup(fields, options);
    const form = {
      field,
      element,
    } satisfies FormGroupObject;

    return {
      form,
      submit: {
        ...submit,
        onsubmit: () => {
          if (form.field.valid()) {
            submit.onsubmit(form.field.value());
            form.field.reset();
          }
        },
      },
    };
  }
}
