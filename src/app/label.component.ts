import { Component, input } from '@angular/core';
import { Layer } from '../layers/types';
import { rxResource } from '@angular/core/rxjs-interop';
import { of } from 'rxjs';

@Component({
  selector: 'app-label',
  exportAs: 'appLabel',
  template: `
    <a href="#" class="list-disc marker:color-current" [style.color]="label.value()?.color">
      <span>
        @if (label.isLoading()) {
          <span class="animate-pulse">Loading...</span>
        } @else if (label.error()) {
          {{ label.error() }}
        } @else {
          {{ label.value()?.name }}
        }
      </span>
    </a>
  `,
})
export class LabelComponent {
  public layer = input.required<Layer>();

  protected label = rxResource({
    params: this.layer,
    stream: ({ params }) => params.label ?? of(undefined),
  });
}
