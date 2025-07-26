import {
  CdkVirtualScrollViewport,
  FixedSizeVirtualScrollStrategy,
  VirtualScrollStrategy,
} from '@angular/cdk/scrolling';

export class FreezeVirtualScrollStrategy extends FixedSizeVirtualScrollStrategy implements VirtualScrollStrategy {
  private viewport: CdkVirtualScrollViewport | null = null;
  private previousDataLength = 0;

  constructor(public itemSize = 30) {
    super(itemSize, 0, 50);
  }

  override attach(viewport: CdkVirtualScrollViewport): void {
    this.previousDataLength = viewport.getDataLength();
    this.viewport = viewport;
    super.attach(viewport);
  }

  override onDataLengthChanged(): void {
    if (!this.viewport) return;

    const currentDataLength = this.viewport.getDataLength();

    const deltaItems = currentDataLength - this.previousDataLength;
    const scrollOffset = this.viewport.measureScrollOffset();

    if (scrollOffset > 0 && deltaItems > 0) {
      const newOffset = scrollOffset + deltaItems * this.itemSize;
      this.viewport.scrollTo({ top: newOffset });
    }

    this.previousDataLength = currentDataLength;
    super.onDataLengthChanged();
  }
}
