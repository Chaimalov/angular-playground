import { Prettify } from '@ngrx/signals';
import { FormField, FormGroup } from 'ng-signal-forms';

export type SelectComponent = FieldComponent<
  {
    component: 'select';
    type: string;
  },
  {
    values: string[];
    multiple?: boolean;
  }
>;

export type RadioComponent = FieldComponent<
  {
    component: 'radio';
    type: string;
  },
  {
    values: string[];
  }
>;

export type CheckboxComponent = FieldComponent<{
  component: 'checkbox';
  type: boolean;
}>;

export type TextareaComponent = FieldComponent<
  {
    component: 'textarea';
    type: string;
  },
  {
    lines?: number;
  }
>;

export type DateComponent = FieldComponent<{
  component: 'date';
  type: Date;
}>;

export type NumberComponent = FieldComponent<{
  component: 'number';
  type: number;
}>;

export type TextComponent = FieldComponent<{
  component: 'text';
  type: string;
}>;

export type FieldsetComponent = {
  component: 'fieldset';
  children: Record<string, FormFieldComponent | FieldsetComponent>;
  label?: string;
};

type FieldComponent<
  T extends { component: string; type: unknown },
  Options extends Record<string, unknown> | undefined = undefined,
> = Prettify<
  {
    component: T['component'];
    value: T['type'];
    label?: string;
  } & (T['type'] extends boolean
    ? {}
    : {
        placeholder?: T['type'];
      }) &
    (Options extends undefined ? {} : { options?: Options })
>;

export type FormComponent =
  | TextComponent
  | NumberComponent
  | DateComponent
  | CheckboxComponent
  | RadioComponent
  | SelectComponent
  | TextareaComponent
  | FieldsetComponent;

export type FormFieldComponent = Exclude<FormComponent, FieldsetComponent>;

export type FormGroupObject = {
  field: FormGroup<Record<string, FormField | FormGroup>>;
  element: FieldsetComponent;
};

export type FormFieldObject = { field: FormField; element: FormFieldComponent };
export type FormObject = FormGroupObject | FormFieldObject;
