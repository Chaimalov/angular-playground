import { DatePipe } from '@angular/common';
import { Component, signal } from '@angular/core';
import { v4 } from 'uuid';
import { CollapsibleCardComponent } from './card.component';
import { FocusableDirective } from './focusable.directive';
import { KeyManagerDirective } from './key-manager.directive';
import { VirtualItemComponent } from './virtual-item.component';
import { VirtualListComponent } from './virtual-list.component';

@Component({
  selector: 'app-queue',
  templateUrl: './queue.component.html',
  imports: [
    DatePipe,
    CollapsibleCardComponent,
    VirtualListComponent,
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
