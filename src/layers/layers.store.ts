import { ApplicationRef, createEnvironmentInjector, DestroyRef, EnvironmentInjector, inject } from '@angular/core';
import { patchState, signalStore, SignalStoreFeature, type, withMethods } from '@ngrx/signals';
import { addEntity, removeEntity, setEntity, withEntities } from '@ngrx/signals/entities';
import { RegisterMethod } from '../register';
import { requiredFeatures, SetupFeatureResult } from './create-layer-model';
import { LayerModel } from './layer-model.types';
import { Layer, LayerId } from './types';

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

/**
 * @summary
 * The layer store is a central location for managing the layers in your application.
 * It provides a convenient way to add, remove, and retrieve layers.
 *
 * To add a new layer, call the `addLayer` method and pass in a `LayerConfig` object.
 * To remove a layer, call the `removeLayer` method and pass in the layer's id.
 *
 * @publicApi
 * @see Layer
 * @see LayerConfig
 * @see LayerModelRegistry
 */
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
    const layerModelRegistry = new Map<string, LayerModel>();
    const ref = inject(ApplicationRef);

    const registerLayerModel: RegisterMethod = (id: string, ...features: [SignalStoreFeature<SetupFeatureResult>]) => {
      if (!layerModelRegistry.has(id)) {
        const model = signalStore(requiredFeatures(), ...features);
        layerModelRegistry.set(id, model);
      } else {
        console.warn(`LayerModel with id '${id}' already exists`);
      }
    };

    return {
      /**
       * Registers a layer model with the specified ID and features.
       *
       * This method adds a new layer model to the internal registry if it does not
       * already exist. If a layer model with the given ID already exists, a warning
       * message is logged.
       *
       * @param {string} id - The unique identifier for the layer model.
       * @param {...SignalStoreFeature<SetupFeatureResult>} features - The features to
       * include in the layer model.
       * @throws Will log a warning if a LayerModel with the given ID already exists.
       */
      registerLayerModel,
      /**
       * Adds a new layer to the store.
       *
       * @param {LayerConfig} layerConfig - Configuration for the layer to be added.
       * @throws Will throw an error if the LayerModel does not exist.
       */
      addLayer: ({ id, model }: LayerConfig) => {
        const LayerModel = layerModelRegistry.get(model);

        if (!LayerModel) {
          throw new Error(`LayerModel with id '${model}' does not exist`);
        }

        const layerInjector = createEnvironmentInjector(
          [
            { provide: LayerId, useValue: { id } },
            { provide: Layer, useClass: LayerModel },
          ],
          injector,
          id
        );

        const layer = layerInjector.get(Layer);

        layerInjector.get(DestroyRef).onDestroy(() => {
          document.startViewTransition(() => {
            patchState(store, removeEntity(id, { collection: 'layers' }));
            ref.components[0].changeDetectorRef.detectChanges();
          });
        });

        document.startViewTransition(() => {
          patchState(store, setEntity(layer, { collection: 'layers' }));
          ref.components[0].changeDetectorRef.detectChanges();
        });
      },
      removeLayer: (id: string) => {
        store.layersEntityMap()[id]?.destroy();
      },
    };
  })
);
