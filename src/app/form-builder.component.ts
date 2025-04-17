import { KeyValuePipe } from '@angular/common';
import { Component, inject, input } from '@angular/core';
import { LabelComponent } from './label.component';
import { FormsModule } from '@angular/forms';
import { SignalInputDirective } from 'ng-signal-forms';
import { Form, FormService } from '../forms/form.service';

@Component({
  selector: 'app-form-builder',
  imports: [KeyValuePipe, FormsModule, SignalInputDirective],
  template: `
    <fieldset class="grid gap-2 p-4">
      @for (control of form().controls | keyvalue; track control.key) {
        @if (control.value.__type === 'FormField') {
          <label for="{{ control.key }}">{{ control.key }}</label>
          <input
            type="text"
            id="{{ control.key }}"
            class="p-2 border border-gray-300 [.ng-invalid]:border-red-500"
            ngModel
            [formField]="control.value" />
          @for (error of control.value.errors() | keyvalue; track error.key) {
            <span>{{ error.value.message }}</span>
          }
        } @else {
          <legend>{{ control.key }}</legend>
          <app-form-builder [form]="control.value"></app-form-builder>
        }
      }
    </fieldset>
  `,
})
export class FormBuilderComponent {
  public form = input.required<Form>();
}
