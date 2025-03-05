import { KeyValuePipe } from '@angular/common';
import { Component, inject, linkedSignal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { withMethods } from '@ngrx/signals';
import { v4 } from 'uuid';
import { JokesLayer, Layer, LayerStore, UserLayer } from '../layers';
import { LabelComponent } from './label.component';
import { Table } from '../store-features';

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
    this.store.registerLayerModel('User', UserLayer());
    this.store.registerLayerModel('Joke', JokesLayer());

    Array.from({ length: 20 }).forEach((_, i) => {
      this.store.addLayer({
        id: v4(),
        model: Math.random() > 0.5 ? 'User' : 'Joke',
      });
    });
  }
}
