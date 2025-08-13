import { DatePipe } from '@angular/common';
import { Component, signal } from '@angular/core';
import { v4 } from 'uuid';
import { CollapsibleCardComponent } from './card.component';
import { VirtualListComponent } from './virtual-list.component';
import { VirtualForOfDirective } from './virtual-for-of.directive';
import { VirtualItemComponent } from './virtual-item.component';
import { FocusableDirective } from './focusable.directive';
import { KeyManagerDirective } from './key-manager.directive';

@Component({
  selector: 'app-queue',
  template: ` <button (click)="addItems()">Add Item</button>
    <app-virtual-list keyManager="focus" class="grid gap-2 p-2 h-100 overflow-auto border border-amber-200">
      <app-virtual-item
        *appVirtualFor="let item of items(); idKey: 'id'; let index = $index; let id = $id"
        appFocusable
        [attr.data-id]="id">
        @if (index % 100 === 0) {
          <div content class="m-auto p-2 z-10 bg-neutral-400 rounded">
            <span>{{ index }}</span>
          </div>
        } @else {
          <app-collapsible-card
            content
            dir="rtl"
            class="in-focus:bg-gray-700 p-4 border block border-amber-100 rounded">
            <h2>{{ index }}</h2>
            {{ item.creationDate | date: 'HH:mm:ss' }}
            <p>
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptatum officiis adipisci facere aperiam saepe
              doloribus, harum quas sed itaque dolor?
            </p>
          </app-collapsible-card>
        }

        <div placeholder class="h-30 bg-neutral-700"></div>
      </app-virtual-item>
    </app-virtual-list>`,
  imports: [
    DatePipe,
    CollapsibleCardComponent,
    VirtualListComponent,
    VirtualForOfDirective,
    FocusableDirective,
    VirtualItemComponent,
    KeyManagerDirective,
  ],
})
export class QueueComponent {
  protected items = signal(Array.from({ length: 3000 }, () => ({ id: v4(), creationDate: new Date().toISOString() })));

  protected addItems(): void {
    const newItem = { id: v4(), creationDate: new Date().toISOString() };
    this.items.update(items => [newItem, ...items]);
  }
}
