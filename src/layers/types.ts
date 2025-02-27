import { EmptyFeatureResult, signalStore, SignalStoreFeature } from '@ngrx/signals';
import { Prettify, withColumns, withImage, withLabel, withRows } from '../store-features';
import { inject, InjectionToken } from '@angular/core';
import { withCleanup } from '../store-features/with-cleanup';
import { LayerModel } from './layer-builder.types';

export type SignalStoreFeatureResultExtractor<T extends SignalStoreFeature> =
  T extends SignalStoreFeature<EmptyFeatureResult, infer R> ? R : never;

type LayerId = { id: string };
export const LAYER_ID = new InjectionToken<LayerId>('layerId');

export type Layer = InstanceType<LayerModel>;

export const Layer = new InjectionToken<Layer>('Layer');
