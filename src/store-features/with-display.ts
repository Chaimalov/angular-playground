import { resource } from '@angular/core';
import { signalStoreFeature, SignalStoreFeatureResult, type, withProps } from '@ngrx/signals';
import { Retrievable, resolveResource } from './utils';
import { Store } from '../layers/create-layer-model';

type Label = {
  name: string;
  color: string;
};

const LABEL_REF = Symbol('label');

const withLabel = <Params extends SignalStoreFeatureResult>(
  provider: (params: Store<Params>) => Retrievable<Label | undefined>
) => {
  return signalStoreFeature(
    type<Params>(),
    withProps(params => {
      const labelResource = resource({
        request: () => provider(params),
        stream: resolveResource,
      });

      return {
        label: labelResource.asReadonly(),
        [LABEL_REF]: labelResource,
      };
    })
  );
};

/**
 * Creates a feature that adds a `imageUrl` property to the store
 * with the values returned from the provider.
 *
 * The provider function takes the store as an argument and must
 * return an object with a `value` property of type `Retrievable<string | undefined>`.
 *
 * The feature will create a resource for the `imageUrl` property of the store,
 * and will add the resource as a property on the store.
 *
 * @example
 *
 * Visuals.withImage(({ context }) => context.user.value()?.imageUrl)
 */
const withImage = <Params extends SignalStoreFeatureResult>(
  provider: (params: Store<Params>) => Retrievable<string | undefined>
) => {
  return signalStoreFeature(
    type<Params>(),
    withProps(params => {
      const imageResource = resource({
        request: () => provider(params),
        stream: resolveResource,
      });

      return {
        imageUrl: imageResource.asReadonly(),
      };
    })
  );
};

/**
 * Utilities for creating visual features.
 *
 * @publicApi
 */
export const Visuals = {
  /**
   * Creates a feature that provides a label.
   */
  withLabel,
  withImage,
};
