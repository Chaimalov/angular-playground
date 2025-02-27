import { KeyValuePipe } from '@angular/common';
import { ApplicationRef, Component, effect, inject, linkedSignal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Layer, LayerStore } from '../layers';
import { LabelComponent } from './label.component';
import { v4 } from 'uuid';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, KeyValuePipe, LabelComponent],
  templateUrl: './app.component.html',
})
export class AppComponent {
  protected store = inject(LayerStore);

  protected selected = linkedSignal({
    source: () => this.store.layersEntities()[0],
    computation: (source, previous: { value: Layer } | undefined) => {
      if (previous?.value && this.store.layersEntityMap()[previous.value.id]) {
        return previous.value;
      }
      return source;
    },
  });
  protected layers = this.store.layersEntities;

  protected setSelected(layer: Layer): void {
    document.startViewTransition(() => {
      this.selected.set(layer);
    });
  }

  constructor() {
    Array.from({ length: 20 }).forEach((_, i) => {
      this.store.addLayer({
        id: v4(),
        model: Math.random() > 0.5 ? 'User' : 'Joke',
      });
    });
  }
}
