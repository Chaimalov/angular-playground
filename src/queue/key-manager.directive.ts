import { afterNextRender, contentChildren, Directive, HostAttributeToken, inject, Injector } from '@angular/core';
import { FocusableDirective } from './focusable.directive';
import { ActiveDescendantKeyManager, FocusKeyManager } from '@angular/cdk/a11y';

@Directive({
  selector: '[keyManager]',
  host: {
    '(keydown)': 'manager.onKeydown($event)',
    role: 'list',
    tabindex: '0',
  },
})
export class KeyManagerDirective {
  private keyManager = inject(new HostAttributeToken('keyManager'), { optional: true });
  private items = contentChildren(FocusableDirective, { descendants: true });

  public manager = new (this.keyManager === 'focus' ? FocusKeyManager : ActiveDescendantKeyManager)(
    this.items,
    inject(Injector)
  );

  constructor() {
    afterNextRender(() => {
      this.manager.setFirstItemActive();
    });
  }
}
