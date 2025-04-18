import { Component, inject } from '@angular/core';
import { FormService } from '../forms/form.service';
import { GenericFormComponent } from './generic-form.component';
import { JsonPipe } from '@angular/common';
import { V } from 'ng-signal-forms';

@Component({
  selector: 'app-form-test',
  imports: [GenericFormComponent, JsonPipe],
  template: `
    <h1>Form Test</h1>
    <form app-generic-form [form]="form.form" (submit)="$event.preventDefault(); form.submit.onsubmit()">
      <button type="submit">{{ form.submit.label }}</button>
    </form>
    <pre>{{ form.form.field.value() | json }}</pre>
    <pre>{{ form.form.field.errorsArray() | json }}</pre>
  `,
})
export class FormTestComponent {
  protected formService = inject(FormService);

  private disableAddress = this.formService.createFormField({
    component: 'checkbox',
    value: false,
    label: 'Disable Address',
  });

  protected form = this.formService.createForm({
    fields: {
      disableAddress: this.disableAddress,
      name: this.formService.createFormField({
        component: 'text',
        value: '',
        label: 'Name',
        placeholder: 'Enter your name',
        validators: [
          {
            validator: V.required(),
            message: 'Name is required',
          },
        ],
      }),
      shipping: this.formService.createFormField({
        component: 'radio',
        value: 'standard',
        label: 'Shipping Method',
        options: {
          values: ['standard', 'express'],
        },
      }),
      address: this.formService.createFormGroup(
        {
          street: this.formService.createFormField({
            component: 'text',
            value: '',
            label: 'Street',
            placeholder: 'Enter your street',
            disabled: this.disableAddress.field.value,
          }),
          city: this.formService.createFormField({
            component: 'text',
            value: '',
            label: 'City',
            placeholder: 'Enter your city',
          }),
          state: this.formService.createFormField({
            component: 'text',
            value: '',
            label: 'State',
            placeholder: 'Enter your state',
          }),
          zip: this.formService.createFormField({
            component: 'text',
            value: '',
            label: 'Zip Code',
            placeholder: 'Enter your zip code',
          }),
        },
        {
          label: 'Address',
        }
      ),
      payment: this.formService.createFormGroup({
        cardNumber: this.formService.createFormField({
          component: 'text',
          value: '',
          label: 'Card Number',
          placeholder: 'Enter your card number',
          validators: [
            {
              validator: V.required(),
              message: 'Card number is required',
            },
            {
              validator: V.minLength(16),
              message: 'Card number must be at least 16 digits long',
            },
          ],
        }),
        expirationDate: this.formService.createFormGroup({
          month: this.formService.createFormField({
            component: 'select',
            value: '',
            label: 'Expiration Month',
            options: {
              values: Array.from({ length: 12 }, (_, i) => (i + 1).toString()),
            },
          }),
          year: this.formService.createFormField({
            component: 'select',
            value: '',
            label: 'Expiration Year',
            options: {
              values: Array.from({ length: 10 }, (_, i) => (new Date().getFullYear() + i).toString()),
            },
          }),
        }),
      }),
      description: this.formService.createFormField({
        component: 'textarea',
        value: '',
        label: 'Description',
        placeholder: 'Enter a description',
        validators: [
          {
            validator: V.minLength(10),
            message: 'Description must be at least 10 characters long',
          },
        ],
      }),
    },
    submit: {
      label: 'Sign Up',
      onsubmit: form => {
        console.log('Form submitted:', form);
      },
    },
  });
}
