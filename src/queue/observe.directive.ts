import { DestroyRef, Directive, ElementRef, inject } from '@angular/core';
import { Observer } from './virtual-list.component';
import { FocusableOption, ListKeyManager, ListKeyManagerOption } from '@angular/cdk/a11y';

@Directive({
  selector: '[appObserve]',
  exportAs: 'focusable',
})
export class ObserveDirective implements FocusableOption, ListKeyManagerOption {
  private element = inject(ElementRef);
  constructor() {
    const destroyRef = inject(DestroyRef);
    const observer = inject(Observer);

    observer.observe(this.element.nativeElement);
    destroyRef.onDestroy(() => {
      observer.unobserve(this.element.nativeElement);
    });
  }

  focus(): void {
    this.element.nativeElement.focus();
  }

  disabled?: boolean | undefined;
}
