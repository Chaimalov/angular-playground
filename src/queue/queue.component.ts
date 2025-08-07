import { DatePipe } from '@angular/common';
import { Component, signal } from '@angular/core';
import { v4 } from 'uuid';
import { CollapsibleCardComponent } from './card.component';
import { VirtualListComponent } from './virtual-list.component';

@Component({
  selector: 'app-queue',
  template: ` <button (click)="addItems()">Add Item</button>
    <app-virtual-list
      [items]="items()"
      tabindex="0"
      idKey="id"
      class="grid gap-1 h-100 overflow-auto border border-amber-200">
      <ng-template let-item>
        <app-collapsible-card dir="rtl" class="group-focus:bg-gray-700 p-4 border block border-amber-100 rounded">
          <h2>{{ item.index }}</h2>
          {{ item.creationDate | date: 'HH:mm:ss' }}
          <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptatum officiis adipisci facere aperiam saepe
            doloribus, harum quas sed itaque dolor?
          </p>
        </app-collapsible-card>
      </ng-template>
    </app-virtual-list>`,
  imports: [DatePipe, CollapsibleCardComponent, VirtualListComponent],
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
