import {
  EmptyFeatureResult,
  signalStore,
  SignalStoreFeature,
} from '@ngrx/signals';
import {
  Prettify,
  withColumns,
  withImage,
  withLabel,
  withRows,
} from '../store-features';
import { inject, InjectionToken } from '@angular/core';

type SignalStoreFeatureResultExtractor<T extends SignalStoreFeature> =
  T extends SignalStoreFeature<EmptyFeatureResult, infer R> ? R : never;

type LayerId = { id: string };
export const LAYER_ID = new InjectionToken<LayerId>('layerId');

export type Layer = Prettify<
  LayerId &
    Partial<
      InstanceType<
        ReturnType<
          typeof signalStore<
            SignalStoreFeatureResultExtractor<
              ReturnType<typeof withImage<any>>
            >,
            SignalStoreFeatureResultExtractor<
              ReturnType<typeof withLabel<any>>
            >,
            SignalStoreFeatureResultExtractor<ReturnType<typeof withRows<any>>>,
            SignalStoreFeatureResultExtractor<
              ReturnType<typeof withColumns<any>>
            >
          >
        >
      >
    >
>;

export const Layer = new InjectionToken<Layer>('Layer');
