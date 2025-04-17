import { JsonPipe, KeyValuePipe } from '@angular/common';
import { Component, inject, linkedSignal } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { combineLatest, map, of } from 'rxjs';
import { v4 } from 'uuid';
import { FormService } from '../forms/form.service';
import { JokesLayer, Layer, LayerStore, UserLayer } from '../layers';
import { FormBuilderComponent } from './form-builder.component';
import { LabelComponent } from './label.component';

@Component({
  selector: 'app-root',
  imports: [KeyValuePipe, LabelComponent, FormsModule, FormBuilderComponent, JsonPipe],
  templateUrl: './app.component.html',
})
export class AppComponent {
  protected store = inject(LayerStore);
  public formService = inject(FormService);

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

  protected selectedResource = rxResource({
    request: this.selected,
    loader: ({ request }) =>
      combineLatest([request.imageUrl ?? of(undefined), request.tableRows ?? of(undefined)]).pipe(
        map(([image, rows]) => ({ image, rows }))
      ),
  });

  constructor() {
    this.store.registerLayerModel('User', UserLayer);
    this.store.registerLayerModel('Joke', JokesLayer);

    Array.from({ length: 20 }).forEach((_, i) => {
      this.store.addLayer({
        id: v4(),
        model: Math.random() > 0.5 ? 'User' : 'Joke',
      });
    });
  }
}
