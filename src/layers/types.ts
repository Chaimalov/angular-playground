import { InjectionToken } from '@angular/core';
import { LayerModel } from './layer-model.types';

export type LayerId = { id: string };
export const LayerId = new InjectionToken<LayerId>('layerId');

/**
 * @
 * Represents a layer within the application.
 *
 * A layer encapsulates data and behavior, managed by the `LayerStore`.
 * It can represent different models.
 * Layers are created using the `createLayerModel` function and can
 * be customized with specific properties and behaviors.
 *
 * @publicApi
 * @see createLayerModel
 * @see LayerStore
 */
export type Layer = InstanceType<LayerModel>;
export const Layer = new InjectionToken<Layer>('Layer');
