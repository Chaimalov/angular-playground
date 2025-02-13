import { patchState, signalStore, type, withMethods } from '@ngrx/signals';
import { addEntity, removeEntity, withEntities } from '@ngrx/signals/entities';
import { inject, Injector } from '@angular/core';
import { JokesLayer } from './jokes-layer';
import { Layer, LAYER_ID } from './types';
import { UserLayer } from './user-layer';

/**
 * Parameters for adding a new layer.
 *
 * @property {string} id - The unique identifier for the layer.
 * @property {'User' | 'Joke'} model - The type of model associated with the layer.
 */
type LayerConfig = {
  id: string;
  model: 'User' | 'Joke';
};

export const LayerStore = signalStore(
  {
    providedIn: 'root',
  },
  withEntities({
    collection: 'layers',
    entity: type<Layer>(),
  }),
  withMethods(store => {
    const injector = inject(Injector);

    return {
      addLayer: ({ id, model }: LayerConfig) => {
        const layer = Injector.create({
          parent: injector,
          name: id,
          providers: [
            {
              provide: LAYER_ID,
              useValue: { id },
            },
            {
              provide: Layer,
              useClass: (() => {
                switch (model) {
                  case 'User':
                    return UserLayer;
                  case 'Joke':
                    return JokesLayer;
                }
              })(),
            },
          ],
        }).get(Layer);

        patchState(
          store,
          addEntity(layer, {
            collection: 'layers',
          })
        );
      },
      removeLayer: (id: string) => {
        // Remove the layer with the specified ID.
        patchState(store, removeEntity(id, { collection: 'layers' }));
      },
    };
  })
);
