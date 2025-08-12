import { DestroyRef, Directive, ElementRef, inject } from '@angular/core';
import { Observer } from './virtual-list.component';

@Directive({
  selector: '[appVirtualized]',
})
export class VirtualizedItemDirective {
  private element = inject(ElementRef);
  constructor() {
    const destroyRef = inject(DestroyRef);
    const observer = inject(Observer);

    observer.observe(this.element.nativeElement);
    destroyRef.onDestroy(() => {
      observer.unobserve(this.element.nativeElement);
    });
  }
}
