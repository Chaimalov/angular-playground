import { FocusKeyManager, ListKeyManager } from '@angular/cdk/a11y';
import { NgTemplateOutlet } from '@angular/common';
import {
  afterNextRender,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  computed,
  contentChild,
  contentChildren,
  DestroyRef,
  effect,
  ElementRef,
  forwardRef,
  HostAttributeToken,
  inject,
  InjectionToken,
  Injector,
  input,
  linkedSignal,
  signal,
  TemplateRef,
  viewChild,
  viewChildren,
} from '@angular/core';
import { VirtualizedItemDirective } from './observe.directive';
import { VirtualForOfDirective } from './virtual-for-of.directive';
import { FocusableDirective } from './focusable.directive';

export const Observer = new InjectionToken<IntersectionObserver>('IntersectionObserver');
export type Observer = IntersectionObserver;

/**
 * VirtualListComponent
 *
 * A performant, accessible Angular component for rendering large, scrollable lists using virtualization.
 * Only the items currently visible in the viewport are rendered, improving performance for long lists.
 *
 * ### Features
 * - **Virtualization:** Renders only visible items for optimal performance.
 * - **Keyboard Navigation:** Supports arrow key navigation and focus management.
 * - **Custom Item Templates:** Use the {@link VirtualForOfDirective} structural directive to define item rendering.
 * - **Configurable:** Supports custom item height, page size, and root margin via host attributes.
 *
 * ### Usage Example (Structural Directive)
 * ```html
 * <app-virtual-list [pageSize]="50" placeholderHeight="80px" rootMargin="600px">
 *   <section *appVirtualFor="let item of items; idKey: 'id'">
 *     {{ item.name }}
 *   </section>
 * </app-virtual-list>
 * ```
 *
 * ### Inputs
 * | Input              | Type     | Default    | Description                                                      |
 * |--------------------|----------|------------|------------------------------------------------------------------|
 * | `placeholderHeight`| string   | '100px'    | Minimum height for each item placeholder                         |
 * | `rootMargin`       | string   | '500px'    | Margin around the root for intersection observer                 |
 * | `pageSize`         | number   | 100        | Number of items to render per page                               |
 *
 * ### Methods
 * - `scrollToTop()`: Scrolls to the top of the list and focuses the first item.
 * - `scrollToId(id: string)`: Scrolls to and focuses the item with the given id.
 */
@Component({
  selector: 'app-virtual-list',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgTemplateOutlet, VirtualizedItemDirective, FocusableDirective],
  template: `
    <div #topSentinel class="h-1"></div>
    @for (item of inRangeItems(); track item[idKey()]) {
      <!-- <div
        appVirtualized
        #element
        [attr.data-id]="item[idKey()]"
        style="min-height: {{ placeholderHeight }}"
        class="h-max group [content-visibility:auto] empty:bg-gray-900 contents"
        role="listitem"
        tabindex="0"> -->
      <ng-container
        [ngTemplateOutlet]="template()"
        [ngTemplateOutletContext]="{
          $implicit: item,
          $index: $index + range().start,
          $id: item[idKey()],
        }"></ng-container>
      <!-- </div> -->
    }
    <div #bottomSentinel class="h-1"></div>
  `,
  providers: [
    {
      provide: Observer,
      useFactory: (virtual: VirtualListComponent<unknown>) => virtual.observer,
      deps: [forwardRef(() => VirtualListComponent)],
    },
    {
      provide: ListKeyManager,
      useFactory: (virtual: VirtualListComponent<unknown>) => virtual.keyManager,
      deps: [forwardRef(() => VirtualListComponent)],
    },
  ],
  host: {
    '(keydown)': 'keyManager.onKeydown($event)',
    role: 'list',
    tabindex: '0',
  },
})
export class VirtualListComponent<T> {
  placeholderHeight = inject(new HostAttributeToken('placeholderHeight'), { optional: true }) ?? '100px';
  rootMargin = inject(new HostAttributeToken('rootMargin'), { optional: true }) ?? '500px';

  items = signal<T[]>([]);
  idKey = signal<keyof T>('id' as keyof T);
  template = contentChild.required(VirtualForOfDirective, { read: TemplateRef });

  private destroyRef = inject(DestroyRef);
  private injector = inject(Injector);
  private element = inject<ElementRef<HTMLElement>>(ElementRef);
  private cdr = inject(ChangeDetectorRef);

  private readonly observerOptions = {
    root: this.element.nativeElement,
    rootMargin: this.rootMargin,
    threshold: 0.1,
    // Optional delay to reduce performance impact
    // only works in Chromium browsers
    ...{ delay: 100 },
  } satisfies IntersectionObserverInit;

  private topSentinelElement = viewChild.required<ElementRef<HTMLElement>>('topSentinel');
  private bottomSentinelElement = viewChild.required<ElementRef<HTMLElement>>('bottomSentinel');

  public pageSize = input(100);
  protected page = signal(1);

  protected range = linkedSignal(() => {
    const page = this.page();
    const halfPageSize = this.pageSize() / 2;

    const start = Math.max(0, (page - 1) * this.pageSize() - halfPageSize);
    const end = Math.min(this.items().length, page * this.pageSize() + halfPageSize);

    return { start, end };
  });

  protected inRangeItems = computed(() => {
    const { start, end } = this.range();
    return this.items().slice(start, end);
  });

  protected intersections = new WeakMap<Element, boolean>();

  /**
   * @internal
   * @private
   */
  public observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      this.intersections.set(entry.target, entry.isIntersecting);
    });

    this.cdr.markForCheck();
  }, this.observerOptions);

  private topSentinelObserver = new IntersectionObserver(
    ([entry]) => {
      if (entry.isIntersecting) {
        this.page.update(page => Math.max(1, page - 1));
      }
    },
    { ...this.observerOptions, rootMargin: '2000px' }
  );

  private bottomSentinelObserver = new IntersectionObserver(
    ([entry]) => {
      if (entry.isIntersecting) {
        this.page.update(page => Math.min(page + 1, Math.ceil(this.items().length / this.pageSize())));
      }
    },
    { ...this.observerOptions, rootMargin: '2000px' }
  );

  private elements = contentChildren(FocusableDirective, { descendants: true });
  protected keyManager = new FocusKeyManager(this.elements, this.injector);

  constructor() {
    effect(() => {
      console.log(this.elements());
    });

    afterNextRender(() => {
      this.keyManager.setFirstItemActive();

      this.topSentinelObserver.observe(this.topSentinelElement().nativeElement);
      this.bottomSentinelObserver.observe(this.bottomSentinelElement().nativeElement);
    });

    this.destroyRef.onDestroy(() => {
      this.observer.disconnect();
      this.topSentinelObserver.disconnect();
      this.bottomSentinelObserver.disconnect();
    });
  }

  scrollToTop(): void {
    this.page.update(() => 1);

    requestIdleCallback(() => {
      this.element.nativeElement.scrollTo({ top: 0, behavior: 'smooth' });
      this.keyManager.setFirstItemActive();
    });
  }

  scrollToId(id: string): void {
    const element = this.element.nativeElement.querySelector<HTMLElement>(`[data-id="${id}"]`);

    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      element.focus();
    } else {
      const itemIndex = this.items().findIndex(item => item[this.idKey()] === id);

      if (itemIndex === -1) {
        console.warn(`Item with id "${id}" not found in the list.`);
        return;
      }

      const page = Math.floor(itemIndex / this.pageSize());
      this.page.update(() => page);

      requestIdleCallback(() => {
        this.scrollToId(id);
      });
    }
  }
}
