import { EnvironmentInjector, inject } from '@angular/core';
import { signalStoreFeature, SignalStoreFeatureResult, type, withMethods, withProps } from '@ngrx/signals';
import { LayerId } from '../layers';

/**
 * Sets up the layer by injecting the layer ID.
 *
 * @returns A method that sets up the layer.
 */
const withSetup = () => {
  return signalStoreFeature(withProps(() => inject(LayerId)));
};

/**
 * Destroys the layer and removes it from the store.
 *
 * @returns A method that destroys the layer.
 */
const withCleanup = () => {
  return signalStoreFeature(
    withMethods(() => {
      const injector = inject(EnvironmentInjector);

      return {
        /**
         * Destroys the layer and removes it from the store.
         */
        destroy: () => injector.destroy(),
      };
    })
  );
};

export const Lifecycle = {
  withCleanup,
  withSetup,
};
