import { Component, ElementRef, inject } from '@angular/core';
import { FocusableDirective } from './focusable.directive';
import { VirtualizedItemDirective } from './observe.directive';
import { VirtualListComponent } from './virtual-list.component';

@Component({
  selector: 'app-virtual-item',
  template: `
    @if (isIntersecting(element.nativeElement)) {
      <ng-content select="[content]"></ng-content>
    } @else {
      <ng-content select="[placeholder]">
        <div class="h-30 bg-red-400"></div>
      </ng-content>
    }
  `,
  hostDirectives: [VirtualizedItemDirective],
})
export class VirtualItemComponent {
  protected element = inject(ElementRef);
  protected intersections = inject(VirtualListComponent)['intersections'];
  protected isIntersecting = (element: HTMLElement) => this.intersections.get(element) ?? false;
}
