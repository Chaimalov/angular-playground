import { inject } from '@angular/core';
import {
  EmptyFeatureResult,
  signalStore,
  signalStoreFeature,
  SignalStoreFeature,
  withProps,
} from '@ngrx/signals';
import { Asset, Prettify, TupleToIntersect } from '../store-features/utils';
import { withContext } from '../store-features/with-context';
import { withImage } from '../store-features/with-image';
import { withLabel } from '../store-features/with-label';
import { withColumns, withRows } from '../store-features/with-table';
import { LAYER_ID } from './types';

type ExtractParams<T extends Feature> = ReturnType<ReturnType<T>>;

type Feature = () => SignalStoreFeature;

export class LayerModelBuilder<
  Features extends Feature[] = [],
  Params = never,
  Used extends string = '',
> {
  #features: Features;
  public readonly id: string;

  private constructor(features: Features, id: string) {
    this.#features = features;
    this.id = id;
  }

  private next<
    IFeature extends Feature,
    Name extends keyof LayerModelBuilder = never,
  >(feature: IFeature, toOmit?: Name) {
    return Object.assign(
      new LayerModelBuilder([...this.#features, feature], this.id),
      this,
      toOmit ? { [toOmit]: undefined } : undefined
    ) as unknown as Prettify<
      Omit<
        LayerModelBuilder<
          [...Features, IFeature],
          Prettify<Params & ExtractParams<IFeature>['props']>,
          Used | Name
        >,
        Used | Name
      >
    >;
  }

  public static create(id: string) {
    return new LayerModelBuilder<[], { layerId: string }>([], id);
  }

  public withLabel(...provider: Parameters<typeof withLabel<Params>>) {
    return this.next(() => withLabel(...provider));
  }

  public withImage(...provider: Parameters<typeof withImage<Params>>) {
    return this.next(() => withImage(...provider));
  }

  public withContext<
    Context extends Record<string, (params: Params) => Asset<unknown>>,
  >(...provider: Parameters<typeof withContext<Params, Context>>) {
    return this.next(() => withContext<Params, Context>(...provider));
  }

  // #region Table Feature
  public withColumns(...provider: Parameters<typeof withColumns<Params>>) {
    return this.next(() => withColumns(...provider), 'withColumns');
  }

  public withRows(...provider: Parameters<typeof withRows<Params>>) {
    return this.next(() => withRows(...provider), 'withRows');
  }
  // #endregion

  public build() {
    const withFeatures = () =>
      signalStoreFeature<
        TupleToIntersect<{
          [K in keyof Features]: ReturnType<ReturnType<Features[K]>>;
        }> &
          EmptyFeatureResult
      >(...(this.#features.map(feature => feature()) as [any]));
    return signalStore(
      withProps(() => inject(LAYER_ID)),
      withFeatures()
    );
  }
}
