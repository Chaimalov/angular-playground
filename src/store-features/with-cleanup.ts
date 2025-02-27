import { EnvironmentInjector, inject } from '@angular/core';
import { signalStoreFeature, withMethods } from '@ngrx/signals';

export const withCleanup = () => {
  return signalStoreFeature(
    withMethods(store => {
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
