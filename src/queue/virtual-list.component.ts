import { NgTemplateOutlet } from '@angular/common';
import { Component, contentChild, input, TemplateRef } from '@angular/core';

@Component({
  selector: 'app-virtual-list',
  imports: [NgTemplateOutlet],
  template: `
    @for (item of items(); track $index) {
      <ng-container [ngTemplateOutlet]="template()" [ngTemplateOutletContext]="{ $implicit: item }"></ng-container>
    }
  `,
})
export class VirtualListComponent<T> {
  items = input.required<T[]>();
  template = contentChild.required(TemplateRef);
}
