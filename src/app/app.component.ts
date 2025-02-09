import { KeyValuePipe } from '@angular/common';
import { Component, inject, linkedSignal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { LayerStore } from '../layers';
import { LabelComponent } from './label.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, KeyValuePipe, LabelComponent],
  templateUrl: './app.component.html',
})
export class AppComponent {
  private store = inject(LayerStore);
  protected selected = linkedSignal(() => this.store.layersEntities()[0]);
  protected layers = this.store.layersEntities;

  constructor() {
    Array.from({ length: 20 }).forEach((_, i) => {
      this.store.addLayer({
        id: `layer${i}`,
        model: Math.random() > 0.5 ? 'User' : 'Joke',
      });
    });
  }
}
