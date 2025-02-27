import { resource } from '@angular/core';
import { signalStoreFeature, withProps } from '@ngrx/signals';
import { resolveResource, Retrievable } from './utils';

export const withImage = <Params>(
  provider: (params: Params) => Retrievable<string | undefined>
) => {
  return signalStoreFeature(
    withProps(params => {
      const imageResource = resource({
        request: () => provider(params as Params),
        stream: resolveResource,
      });

      return {
        imageUrl: imageResource.asReadonly(),
      };
    })
  );
};
