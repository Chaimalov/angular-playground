import { FocusKeyManager, ListKeyManager } from '@angular/cdk/a11y';
import { NgTemplateOutlet } from '@angular/common';
import {
  afterNextRender,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  computed,
  contentChild,
  DestroyRef,
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
import { ObserveDirective } from './observe.directive';

export const Observer = new InjectionToken<IntersectionObserver>('IntersectionObserver');
export type Observer = IntersectionObserver;

/**
 * A component that displays a long list of items in a way that is performant and accessible.
 *
 * This component is designed to be used when you have a large list of items that need to be
 * displayed in a scrollable container. It will only render the items that are currently visible
 * in the viewport, which greatly improves performance.
 *
 * The component also provides a way to focus on items in the list using the keyboard.
 *
 * @example
 * ```html
 * <app-virtual-list [items]="items" idKey="id">
 *   <ng-template #template let-item="item">
 *     {{ item.name }}
 *   </ng-template>
 * </app-virtual-list>
 * ```
 */
@Component({
  selector: 'app-virtual-list',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgTemplateOutlet, ObserveDirective],
  template: `
    <div #topSentinel class="h-1"></div>
    @for (item of inRangeItems(); track item[idKey()]) {
      <div
        appObserve
        #element
        #focusable="focusable"
        (focus)="keyManager.setActiveItem(focusable)"
        [attr.data-id]="item[idKey()]"
        style="min-height: {{ placeholderHeight }}"
        class="h-max group [content-visibility:auto] empty:bg-gray-900"
        role="listitem"
        tabindex="0">
        <ng-container
          [ngTemplateOutlet]="intersections.get(element) ? template() : null"
          [ngTemplateOutletContext]="{ $implicit: item }"></ng-container>
      </div>
    }
    <div #bottomSentinel class="h-1"></div>
  `,
  providers: [
    {
      provide: Observer,
      useFactory: (virtual: VirtualListComponent<unknown>) => virtual.observer,
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
  items = input.required<T[]>();
  idKey = input.required<keyof T>();
  template = contentChild.required(TemplateRef);

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
  private page = signal(1);

  private range = linkedSignal(() => {
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

  private topSentinelObserver = new IntersectionObserver(([entry]) => {
    if (entry.isIntersecting) {
      this.page.update(page => Math.max(1, page - 1));
    }
  }, this.observerOptions);

  private bottomSentinelObserver = new IntersectionObserver(([entry]) => {
    if (entry.isIntersecting) {
      this.page.update(page => page + 1);
    }
  }, this.observerOptions);

  private elements = viewChildren(ObserveDirective);
  protected keyManager: ListKeyManager<ObserveDirective> = new FocusKeyManager(this.elements, this.injector);

  constructor() {
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
