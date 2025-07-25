import { CdkVirtualForOf, CdkVirtualScrollViewport, VIRTUAL_SCROLL_STRATEGY } from '@angular/cdk/scrolling';
import { DatePipe } from '@angular/common';
import { Component } from '@angular/core';
import { interval, map, scan } from 'rxjs';
import { FreezeVirtualScrollStrategy } from './FreezeVirtualScrollStrategy';

@Component({
  selector: 'app-queue',
  template: `<cdk-virtual-scroll-viewport class="h-100 w-50 border border-amber-200">
    <div [style.height.px]="30" class="border border-blue-300" *cdkVirtualFor="let item of items; trackBy: trackBy">
      {{ item.creationDate | date: 'HH:mm:ss' }}
    </div>
  </cdk-virtual-scroll-viewport>`,
  imports: [CdkVirtualScrollViewport, CdkVirtualForOf, DatePipe],
  providers: [
    {
      provide: VIRTUAL_SCROLL_STRATEGY,
      useFactory: () => new FreezeVirtualScrollStrategy(),
    },
  ],
})
export class QueueComponent {
  protected items = interval(3000).pipe(
    map(value => Array.from({ length: 1 }, (_, i) => ({ id: i + value, creationDate: new Date().toISOString() }))),
    scan((acc, currentValue) => [...currentValue, ...acc], [] as { id: number; creationDate: string }[])
  );

  protected trackBy(index: number, item: { id: number; creationDate: string }): number {
    return item.id;
  }
}
