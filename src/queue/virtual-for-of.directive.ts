import { Directive, effect, inject, input } from '@angular/core';
import { VirtualListComponent } from './virtual-list.component';

@Directive({
  selector: '[appVirtualFor]',
})
export class VirtualForOfDirective<T> {
  appVirtualForOf = input.required<T[]>();
  appVirtualForIdKey = input.required<keyof T>();

  private virtualList = inject(VirtualListComponent<T>, { skipSelf: true });

  constructor() {
    effect(() => {
      this.virtualList.items.set(this.appVirtualForOf());
      this.virtualList.idKey.set(this.appVirtualForIdKey());
    });
  }

  static ngTemplateContextGuard<T>(dir: VirtualForOfDirective<T>, ctx: unknown): ctx is { $implicit: T } {
    return true;
  }
}
