import { FocusableOption, FocusOrigin, Highlightable, ListKeyManager, ListKeyManagerOption } from '@angular/cdk/a11y';
import { Directive, ElementRef, inject } from '@angular/core';

@Directive({
  selector: '[appFocusable]',
  exportAs: 'focusable',
  host: {
    '[attr.tabindex]': '0',
  },
})
export class FocusableDirective implements FocusableOption, ListKeyManagerOption, Highlightable {
  private element = inject<ElementRef<HTMLElement>>(ElementRef);
  protected keyManager = inject(ListKeyManager);

  setActiveStyles(): void {
    this.element.nativeElement.classList.add('active');
  }
  setInactiveStyles(): void {
    this.element.nativeElement.classList.remove('active');
  }
  focus(origin?: FocusOrigin): void {
    this.element.nativeElement.focus();
  }
  disabled = false;
}
