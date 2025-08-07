import { FocusableOption } from '@angular/cdk/a11y';
import { Component, ElementRef, inject } from '@angular/core';

@Component({
  selector: 'app-collapsible-card',
  template: `
    <details name="card">
      <summary>
        הצג
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          fill="currentColor"
          class="bi bi-chevron-right"
          viewBox="0 0 16 16">
          <path
            fill-rule="evenodd"
            d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708" />
        </svg>
      </summary>
      <div class="card-content">
        <ng-content></ng-content>
      </div>
    </details>
  `,
  styleUrls: ['./card.css'],
})
export class CollapsibleCardComponent implements FocusableOption {
  private elementRef = inject<ElementRef<HTMLElement>>(ElementRef);
  focus(): void {
    this.elementRef.nativeElement.focus();
  }
}
