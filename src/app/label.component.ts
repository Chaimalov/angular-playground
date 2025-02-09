import { Component, input } from '@angular/core';
import { Layer } from '../layers/types';

@Component({
  selector: 'app-label',
  exportAs: 'appLabel',
  template: `
    @let label = layer().label;
    <a
      href="#"
      class="list-disc marker:color-current"
      [style.color]="label?.value()?.color">
      <span>
        @if (!label?.value() || label?.isLoading()) {
          Loading...
        } @else {
          {{ label?.value()?.name }}
        }
      </span>
    </a>
  `,
})
export class LabelComponent {
  public layer = input.required<Layer>();
}
