import { Type } from '@angular/core';
import { LayerModelBuilder } from './layer-builder';
import { Prettify, SignalStoreFeature, StateSource } from '@ngrx/signals';
import { UnionToArray } from '../store-features';

export type Feature = () => SignalStoreFeature;

export type LayerModelBuilderStep<Features extends Feature[], Params, Used extends string> = Required<
  Omit<LayerModelBuilder<Features, Params, Used>, Used>
>;

export type BuilderFeatureMethods = {
  [K in keyof LayerModelBuilder as K extends `with${string}` ? K : never]: LayerModelBuilder[K];
};

export type RequiredFeatureMethods = {
  [K in keyof BuilderFeatureMethods as undefined extends BuilderFeatureMethods[K]
    ? never
    : K]: BuilderFeatureMethods[K];
};

export type Features<Builder extends BuilderFeatureMethods> = UnionToArray<
  {
    [K in keyof Builder]: Builder[K] extends (...args: any) => any
      ? ReturnType<Builder[K]> extends LayerModelBuilderStep<infer F, object, string>
        ? F[0]
        : never
      : never;
  }[keyof Builder]
>;

export type BaseLayerModel = ReturnType<LayerModelBuilder<Features<RequiredFeatureMethods>>['build']>;

export type LayerProps = ReturnType<LayerModelBuilder<Features<Required<BuilderFeatureMethods>>>['build']>;

export type LayerModel =
  BaseLayerModel extends Type<infer B>
    ? LayerProps extends Type<infer R>
      ? Type<Prettify<Omit<Partial<R> & B, keyof StateSource<any>>>>
      : never
    : never;
