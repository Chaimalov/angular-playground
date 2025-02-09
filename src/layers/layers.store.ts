import { patchState, signalStore, type, withMethods } from '@ngrx/signals';
import { addEntity, withEntities } from '@ngrx/signals/entities';
import { inject, Injector } from '@angular/core';
import { JokesLayer } from './jokes-layer';
import { Layer, LAYER_ID } from './types';
import { UserLayer } from './user-layer';

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
      addLayer: ({ id, model }: { id: string; model: 'User' | 'Joke' }) => {
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
    };
  })
);
