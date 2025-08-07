import { FocusKeyManager } from '@angular/cdk/a11y';
import { DatePipe } from '@angular/common';
import { afterNextRender, Component, effect, ElementRef, inject, Injector, signal, viewChildren } from '@angular/core';
import { v4 } from 'uuid';
import { CollapsibleCardComponent } from './card.component';
import { VirtualListComponent } from './virtual-list.component';

@Component({
  selector: 'app-queue',
  template: ` <button (click)="addItems()">Add Item</button>
    <app-virtual-list
      [items]="items()"
      class="h-100 w-50 border border-amber-200"
      (keydown)="keyManager.onKeydown($event)">
      <ng-template #template let-item>
        <app-collapsible-card
          dir="rtl"
          tabindex="0"
          class="focus:border-white block p-4 border border-amber-100 rounded">
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
  private injector = inject(Injector);
  protected items = signal(Array.from({ length: 2 }, () => ({ id: v4(), creationDate: new Date().toISOString() })));
  protected cards = viewChildren<CollapsibleCardComponent, ElementRef<HTMLElement>>(CollapsibleCardComponent, {
    read: ElementRef,
  });

  private elements = viewChildren(CollapsibleCardComponent);

  protected keyManager = new FocusKeyManager(this.elements, this.injector);

  constructor() {
    afterNextRender(() => {
      this.keyManager.setFirstItemActive();
    });

    effect(() => {
      this.elements().forEach(console.log);
    });
  }

  protected addItems(): void {
    const newItems = Array.from({ length: 2 }, () => ({ id: v4(), creationDate: new Date().toISOString() }));
    this.items.update(items => [...newItems, ...items]);
  }

  close(): void {
    this.cards().forEach(card => {
      card.nativeElement.querySelector('details')?.removeAttribute('open');
    });
  }
}
