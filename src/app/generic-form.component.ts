import { KeyValuePipe } from '@angular/common';
import { Component, input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SignalInputDirective } from 'ng-signal-forms';
import { FormGroupObject } from '../forms/form-components';

@Component({
  selector: 'form[app-generic-form], fieldset[app-generic-form]',
  imports: [KeyValuePipe, FormsModule, SignalInputDirective],
  host: {
    class: 'grid gap-2 p-4',
  },
  templateUrl: './generic-form.component.html',
})
export class GenericFormComponent {
  public form = input.required<FormGroupObject>();
}
