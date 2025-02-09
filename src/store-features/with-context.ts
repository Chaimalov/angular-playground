import { Resource, resource, Signal } from '@angular/core';
import { signalStoreFeature, withProps } from '@ngrx/signals';
import { resolveResource, Asset } from './utils';

export const withContext = <
  Params,
  Context extends Record<string, (params: Params) => Asset<unknown>>,
>(
  providers: Context
) => {
  return signalStoreFeature(
    withProps(params => {
      return Object.entries(providers).reduce((acc, [name, provider]) => {
        const contextResource = resource({
          request: () => provider(params as Params),
          loader: resolveResource,
        });

        return {
          ...acc,
          [name]: contextResource.asReadonly(),
        };
      }, {}) as {
        [K in keyof Context]: Resource<
          ReturnType<Context[K]> extends Asset<infer T> ? T : never
        >;
      };
    })
  );
};
