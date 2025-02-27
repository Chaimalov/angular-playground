import { inject } from '@angular/core';
import { EmptyFeatureResult, signalStore, signalStoreFeature, withProps } from '@ngrx/signals';
import { Prettify, Retrievable, TupleToIntersect } from '../store-features/utils';
import { withCleanup } from '../store-features/with-cleanup';
import { withContext } from '../store-features/with-context';
import { withImage } from '../store-features/with-image';
import { withLabel } from '../store-features/with-label';
import { withColumns, withRows } from '../store-features/with-table';
import { Feature, LayerModelBuilderStep } from './layer-builder.types';
import { LAYER_ID } from './types';

type ExtractParams<T extends Feature> = ReturnType<ReturnType<T>>;

export class LayerModelBuilder<Features extends Feature[] = [], Params = never, Used extends string = never> {
  #features: Features;

  private constructor(features: Features) {
    this.#features = features;
  }

  private next<IFeature extends Feature, Name extends keyof LayerModelBuilder = never>(
    feature: IFeature,
    toOmit?: Name
  ) {
    return Object.assign(
      new LayerModelBuilder([...this.#features, feature]),
      this,
      toOmit ? { [toOmit]: undefined } : undefined
    ) as unknown as LayerModelBuilderStep<
      [...Features, IFeature],
      Prettify<Params & ExtractParams<IFeature>['props']>,
      Used | Name
    >;
  }

  public static create() {
    return new LayerModelBuilder([]) as Required<LayerModelBuilder<[], { layerId: string }>>;
  }

  public withLabel(...provider: Parameters<typeof withLabel<Params>>) {
    return this.next(() => withLabel(...provider), 'withLabel');
  }

  public withImage?(...provider: Parameters<typeof withImage<Params>>) {
    return this.next(() => withImage(...provider), 'withImage');
  }

  public withContext?<Context extends Record<string, (params: Params) => Retrievable<unknown>>>(
    ...provider: Parameters<typeof withContext<Params, Context>>
  ) {
    return this.next(() => withContext<Params, Context>(...provider));
  }

  public withColumns?(...provider: Parameters<typeof withColumns<Params>>) {
    return this.next(() => withColumns(...provider), 'withColumns');
  }

  public withRows?(...provider: Parameters<typeof withRows<Params>>) {
    return this.next(() => withRows(...provider), 'withRows');
  }

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
      withFeatures(),
      withCleanup()
    );
  }
}
