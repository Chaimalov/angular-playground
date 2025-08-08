import { DatePipe } from '@angular/common';
import { Component, signal } from '@angular/core';
import { v4 } from 'uuid';
import { CollapsibleCardComponent } from './card.component';
import { VirtualListComponent } from './virtual-list.component';
import { VirtualForOfDirective } from './virtual-for-of.directive';

@Component({
  selector: 'app-queue',
  template: ` <button (click)="addItems()">Add Item</button>
    <app-virtual-list class="grid gap-2 p-2 h-100 overflow-auto border border-amber-200">
      <app-collapsible-card
        *appVirtualFor="let item of items(); idKey: 'id'"
        dir="rtl"
        class="group-focus:bg-gray-700 p-4 border block border-amber-100 rounded">
        <h2>{{ item.index }}</h2>
        {{ item.creationDate | date: 'HH:mm:ss' }}
        <p>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptatum officiis adipisci facere aperiam saepe
          doloribus, harum quas sed itaque dolor?
        </p>
      </app-collapsible-card>
    </app-virtual-list>`,
  imports: [DatePipe, CollapsibleCardComponent, VirtualListComponent, VirtualForOfDirective],
})
export class QueueComponent {
  protected items = signal(
    Array.from({ length: 10_000 }, (_, index) => ({ index, id: v4(), creationDate: new Date().toISOString() }))
  );

  protected addItems(): void {
    const newItem = { index: this.items().length, id: v4(), creationDate: new Date().toISOString() };
    this.items.update(items => [newItem, ...items]);
  }
}
