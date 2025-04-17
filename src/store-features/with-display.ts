import { signalStoreFeature, SignalStoreFeatureResult, type, withProps } from '@ngrx/signals';
import { Observable, share } from 'rxjs';
import { Store } from '../layers/create-layer-model';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { DestroyRef, inject } from '@angular/core';

type Label = {
  name: string;
  color: string;
};

/**
 * Creates a feature that adds a `label` property to the layer
 * with the values returned from the provider.
 *
 * The provider function takes the store as an argument and must
 * return an observable of `{ name: string, color: string }`.
 *
 * @example
 *
 * Visuals.withLabel(({ context }) => context.user.pipe(map((user) => ({ name: user.name, color: user.color }))))
 */
const withLabel = <Params extends SignalStoreFeatureResult>(provider: (params: Store<Params>) => Observable<Label>) => {
  return signalStoreFeature(
    type<Params>(),
    withProps(params => {
      return {
        label: provider(params),
      };
    })
  );
};

/**
 * Creates a feature that adds a `imageUrl` property to the layer
 * with the values returned from the provider.
 *
 * The provider function takes the store as an argument and must
 * return an observable of string.
 *
 * @example
 *
 * Visuals.withImage(({ context }) => context.user.pipe(map((user) => user.imageUrl)))
 */
const withImage = <Params extends SignalStoreFeatureResult>(
  provider: (params: Store<Params>) => Observable<string>
) => {
  return signalStoreFeature(
    type<Params>(),
    withProps(params => {
      const destroyRef = inject(DestroyRef);

      return {
        imageUrl: provider(params).pipe(share(), takeUntilDestroyed(destroyRef)),
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
