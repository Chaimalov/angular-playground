import { resource } from '@angular/core';
import { signalStoreFeature, withProps } from '@ngrx/signals';
import { resolveResource, Asset } from './utils';

export const withImage = <Params>(
  provider: (params: Params) => Asset<string | undefined>
) => {
  return signalStoreFeature(
    withProps(params => {
      const imageResource = resource({
        request: () => provider(params as Params),
        loader: resolveResource,
      });

      return {
        imageUrl: imageResource.asReadonly(),
      };
    })
  );
};
