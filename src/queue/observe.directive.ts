import { FocusableOption, Highlightable, ListKeyManagerOption } from '@angular/cdk/a11y';
import { DestroyRef, Directive, ElementRef, inject } from '@angular/core';
import { Observer } from './virtual-list.component';

@Directive({
  selector: '[appVirtualized]',
  exportAs: 'focusable',
})
export class VirtualizedItemDirective implements FocusableOption, ListKeyManagerOption, Highlightable {
  private element = inject(ElementRef);
  constructor() {
    const destroyRef = inject(DestroyRef);
    const observer = inject(Observer);

    observer.observe(this.element.nativeElement);
    destroyRef.onDestroy(() => {
      observer.unobserve(this.element.nativeElement);
    });
  }
  setActiveStyles(): void {
    this.element.nativeElement.classList.add('active');
  }
  setInactiveStyles(): void {
    this.element.nativeElement.classList.remove('active');
  }

  focus(): void {
    this.element.nativeElement.focus();
  }

  disabled: boolean | undefined;
}
