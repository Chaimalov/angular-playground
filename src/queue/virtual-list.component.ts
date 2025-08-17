import {
  afterNextRender,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  computed,
  DestroyRef,
  ElementRef,
  forwardRef,
  HostAttributeToken,
  inject,
  InjectionToken,
  Injector,
  input,
  linkedSignal,
  runInInjectionContext,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { debounceTime, fromEvent, map } from 'rxjs';

export const Observer = new InjectionToken<IntersectionObserver>('IntersectionObserver');
export type Observer = IntersectionObserver;

export interface VirtualItem<T> {
  $index: number;
  data: T;
}

/**
 * A virtual list component that only renders the items that are currently visible in the viewport.
 *
 * This component is useful for rendering large lists of items without overwhelming the browser with DOM elements.
 *
 * @example
 * ```html
 * <app-virtual-list [items]="items" #virtualList>
 *   `@for (item of virtualList.renderedItems(); track item.data.id) {
 *     <app-virtual-item>
 *        <!-- your content here -->
 *     </app-virtual-item>
 *   }`
 * </app-virtual-list>
 * ```
 */
@Component({
  selector: 'app-virtual-list',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div [style.height.px]="topSpacerHeight()" aria-hidden="true"></div>
    <ng-content></ng-content>
    <div [style.height.px]="bottomSpacerHeight()" aria-hidden="true"></div>
  `,
  providers: [
    {
      provide: Observer,
      useFactory: (virtual: VirtualListComponent<unknown>) => virtual.observer,
      deps: [forwardRef(() => VirtualListComponent)],
    },
  ],
})
export class VirtualListComponent<T> {
  public items = input.required<T[]>();

  private rootMargin = inject(new HostAttributeToken('rootMargin'), { optional: true }) ?? '500px';
  private injector = inject(Injector);
  private destroyRef = inject(DestroyRef);
  private element = inject<ElementRef<HTMLElement>>(ElementRef);
  private cdr = inject(ChangeDetectorRef);

  private averageItemHeight = computed(() => {
    const heights = Array.from(this.element.nativeElement.querySelectorAll<HTMLElement>(`:nth-child(-n+5)`)).map(
      item => item.offsetHeight
    );

    return heights.reduce((sum, height) => sum + height, 0) / heights.length;
  });

  protected topSpacerHeight = computed(() => {
    return this.renderRange().start * this.averageItemHeight();
  });

  protected bottomSpacerHeight = computed(() => {
    return (this.items().length - this.renderRange().end) * this.averageItemHeight();
  });

  public pageSize = input(100);
  protected page = linkedSignal(
    toSignal(
      fromEvent(this.element.nativeElement, 'scroll').pipe(
        debounceTime(100),
        map(() => Math.ceil((this.element.nativeElement.scrollTop + this.rootMargin) / (this.pageSize() * this.averageItemHeight())))
      ),
      { initialValue: 1 }
    )
  );

  protected renderRange = linkedSignal(() => {
    const page = this.page();
    const halfPageSize = this.pageSize() / 2;

    const start = Math.max(0, (page - 1) * this.pageSize() - halfPageSize);
    const end = Math.min(this.items().length, page * this.pageSize() + halfPageSize);

    return { start, end };
  });

  public renderedItems = computed(() => {
    const { start, end } = this.renderRange();
    return this.items()
      .slice(start, end)
      .map((item, index) => ({ $index: start + index, data: item }));
  });

  protected intersections = new WeakMap<Element, boolean>();

  /**
   * @internal
   * @private
   */
  public observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        this.intersections.set(entry.target, entry.isIntersecting);
      });

      this.cdr.markForCheck();
    },
    {
      root: this.element.nativeElement,
      rootMargin: this.rootMargin,
      // Optional delay to reduce performance impact
      // only works in Chromium browsers
      ...{ delay: 100 },
    }
  );

  constructor() {
    this.destroyRef.onDestroy(() => {
      this.observer.disconnect();
    });
  }

  public scrollToTop(): void {
    this.page.update(() => 1);

    runInInjectionContext(this.injector, () => {
      afterNextRender({
        write: () => {
          this.element.nativeElement.scrollTo({ top: 0, behavior: 'auto' });
        },
      });
    });
  }

  public scrollToBottom(): void {
    this.page.update(() => Math.ceil(this.items().length / this.pageSize()));

    runInInjectionContext(this.injector, () => {
      afterNextRender({
        write: () => {
          this.element.nativeElement.scrollTo({ top: this.element.nativeElement.scrollHeight, behavior: 'auto' });
        },
      });
    });
  }

  public scrollToIndex(index: number): void {
    if (index < 0 || index >= this.items().length) {
      console.warn(`Invalid index "${index}" for scrolling.`);
      return;
    }

    this.page.set(Math.ceil(index / this.pageSize()));

    runInInjectionContext(this.injector, () => {
      afterNextRender({
        earlyRead: () => {
          const { start } = this.renderRange();
          return this.element.nativeElement.children.item(index - start + 1 /** Adjust for buffer element */);
        },
        write: element => {
          if (element instanceof HTMLElement) {
            element.scrollIntoView({ behavior: 'auto' });
            element.focus();
          } else {
            console.warn(`Item with index "${index}" not found in the list.`);
          }
        },
      });
    });
  }
}
