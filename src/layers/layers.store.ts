import { ApplicationRef, createEnvironmentInjector, DestroyRef, EnvironmentInjector, inject } from '@angular/core';
import { patchState, signalStore, type, withMethods } from '@ngrx/signals';
import { addEntity, removeEntity, withEntities } from '@ngrx/signals/entities';
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
  /**
   * The unique identifier for the layer.
   */
  id: string;
  /**
   * The type of model associated with the layer.
   */
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
    const injector = inject(EnvironmentInjector);
    const ref = inject(ApplicationRef);

    return {
      addLayer: ({ id, model }: LayerConfig) => {
        const layerInjector = createEnvironmentInjector(
          [
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
          injector,
          id
        );

        const layer = layerInjector.get(Layer);

        layerInjector.get(DestroyRef).onDestroy(() => {
          document.startViewTransition(() => {
            patchState(store, removeEntity(id, { collection: 'layers' }));
            ref.tick();
          });
        });

        document.startViewTransition(() => {
          patchState(
            store,
            addEntity(layer, {
              collection: 'layers',
            })
          );

          ref.tick();
        });
      },
      removeLayer: (id: string) => {
        // Remove the layer with the specified ID.
        store.layersEntityMap()[id]?.destroy();
      },
    };
  })
);
