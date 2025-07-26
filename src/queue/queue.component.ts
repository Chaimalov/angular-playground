import { CdkVirtualForOf, CdkVirtualScrollViewport, VIRTUAL_SCROLL_STRATEGY } from '@angular/cdk/scrolling';
import { DatePipe } from '@angular/common';
import { Component, ElementRef, viewChildren } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { v4 } from 'uuid';
import { FreezeVirtualScrollStrategy } from './FreezeVirtualScrollStrategy';
import { CollapsibleCardComponent } from './card.component';

@Component({
  selector: 'app-queue',
  template: ` <button (click)="addItems()">Add Item</button>
    <cdk-virtual-scroll-viewport class="h-100 w-50 border border-amber-200" (scrolledIndexChange)="close()">
      <app-collapsible-card
        dir="rtl"
        class="block p-4 border border-amber-100 rounded"
        *cdkVirtualFor="let item of items; trackBy: trackBy">
        {{ item.creationDate | date: 'HH:mm:ss' }}
        <p>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptatum officiis adipisci facere aperiam saepe
          doloribus, harum quas sed itaque dolor?
        </p>
      </app-collapsible-card>
    </cdk-virtual-scroll-viewport>`,
  imports: [CdkVirtualScrollViewport, CdkVirtualForOf, DatePipe, CollapsibleCardComponent],
  providers: [
    {
      provide: VIRTUAL_SCROLL_STRATEGY,
      useFactory: () => new FreezeVirtualScrollStrategy(116),
    },
  ],
})
export class QueueComponent {
  protected items = new BehaviorSubject<{ id: string; creationDate: string }[]>([]);
  protected cards = viewChildren<CollapsibleCardComponent, ElementRef<HTMLElement>>(CollapsibleCardComponent, {
    read: ElementRef,
  });

  protected trackBy(index: number, item: { id: string; creationDate: string }): string {
    return item.id;
  }

  protected addItems(): void {
    const newItems = Array.from({ length: 2 }, () => ({ id: v4(), creationDate: new Date().toISOString() }));
    this.items.next([...newItems, ...this.items.value]);
  }

  close(): void {
    this.cards().forEach(card => {
      card.nativeElement.querySelector('details')?.removeAttribute('open');
    });
  }
}
