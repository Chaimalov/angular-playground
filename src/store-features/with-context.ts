import { Resource, resource, Signal } from '@angular/core';
import { signalStoreFeature, withProps } from '@ngrx/signals';
import { resolveResource, Retrievable } from './utils';

export const withContext = <
  Params,
  Context extends Record<string, (params: Params) => Retrievable<unknown>>,
>(
  providers: Context
) => {
  return signalStoreFeature(
    withProps(params => {
      const context = Object.entries(providers).reduce(
        (acc, [name, provider]) => {
          const contextResource = resource({
            request: () => provider(params as Params),
            stream: resolveResource,
          });

          return {
            ...acc,
            [name]: contextResource.asReadonly(),
          };
        },
        {}
      );

      return {
        context: {
          ...(params as any).context,
          ...context,
        } as {
          [K in keyof Context]: ReturnType<
            typeof resource<
              ReturnType<Context[K]> extends Retrievable<infer T> ? T : never,
              unknown
            >
          >;
        },
      };
    })
  );
};
