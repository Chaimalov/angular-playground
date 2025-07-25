import { CdkVirtualScrollViewport, VirtualScrollStrategy } from '@angular/cdk/scrolling';
import { BehaviorSubject, Observable } from 'rxjs';

export class FreezeVirtualScrollStrategy implements VirtualScrollStrategy {
  private readonly scrolledIndexChange$ = new BehaviorSubject(0);
  private viewport: CdkVirtualScrollViewport | null = null;
  private previousDataLength = 0;
  private previousScrollOffset = 0;

  constructor(public itemSize = 30) {}

  attach(viewport: CdkVirtualScrollViewport): void {
    this.viewport = viewport;
    this.previousDataLength = this.viewport.getDataLength();
    this.updateTotalContentSize();
  }

  detach(): void {
    this.viewport = null;
  }

  onContentScrolled(): void {
    if (!this.viewport) return;
    this.previousScrollOffset = this.viewport.measureScrollOffset();
    this.updateRenderedRange();
  }

  onDataLengthChanged(): void {
    if (!this.viewport) return;

    const currentDataLength = this.viewport.getDataLength();
    const deltaItems = currentDataLength - this.previousDataLength;

    if (deltaItems > 0) {
      // Items were added
      const newOffset = this.previousScrollOffset + deltaItems * this.itemSize;
      this.viewport.scrollTo({ top: newOffset });
    }

    this.previousDataLength = currentDataLength;
    this.updateTotalContentSize();
    // this.updateRenderedRange();
  }

  onContentRendered(): void {
    this.updateRenderedRange();
  }

  onRenderedOffsetChanged(): void {
    this.updateRenderedRange();
  }

  scrollToIndex(index: number, behavior: ScrollBehavior): void {
    if (!this.viewport) return;
    this.viewport.scrollToOffset(index * this.itemSize, behavior);
  }

  private updateTotalContentSize(): void {
    if (!this.viewport) return;
    const totalSize = this.viewport.getDataLength() * this.itemSize;
    this.viewport.setTotalContentSize(totalSize);
  }

  private updateRenderedRange(): void {
    if (!this.viewport) return;

    const scrollOffset = this.viewport.measureScrollOffset();
    const viewportSize = this.viewport.getViewportSize();

    // const startIndex = Math.floor(scrollOffset / this.itemSize);
    const endIndex = Math.ceil((scrollOffset + viewportSize) / this.itemSize);

    this.viewport.setRenderedRange({
      start: this.scrolledIndexChange$.value,
      end: endIndex,
    });

    this.scrolledIndexChange$.next(0);
  }

  get scrolledIndexChange(): Observable<number> {
    return this.scrolledIndexChange$.asObservable();
  }
}
