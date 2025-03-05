import { Resource, resource, Signal } from '@angular/core';
import { signalStoreFeature, SignalStoreFeatureResult, type, withProps } from '@ngrx/signals';
import { resolveResource, Retrievable } from './utils';
import { Store } from '../layers/create-layer-model';

export type Context = Record<string, () => Retrievable<unknown>>;

/**
 * @description
 * Creates a feature that adds a `context` property to the store
 * with the values returned from the provider.
 *
 * The provider function takes the store as an argument and must
 * return an object with string keys and values being functions
 * that return a `Retrievable<T>` type.
 *
 * The feature will create a resource for each key in the returned
 * object, and will add the resource as a property on the `context`
 * property of the store.
 *
 * @example
 *
 * const userStore = signalStore(
 *   withContext(params => ({
 *     user: () => params.users.value()[0],
 *     users: () => params.users.value(),
 *   }))
 * );
 *
 * userStore.context.user // returns the first user in the users array
 * userStore.context.users // returns the users array
 */
const withContext = <Params extends SignalStoreFeatureResult, TContext extends Context>(
  provider: (params: Store<Params>) => TContext
) => {
  return signalStoreFeature(
    type<Params>(),
    withProps(params => {
      const providers = provider(params);

      const context = Object.entries(providers).reduce((acc, [name, data]) => {
        const contextResource = resource({
          request: data,
          stream: resolveResource,
        });

        return {
          ...acc,
          [name]: contextResource.asReadonly(),
        };
      }, {});

      return {
        context: {
          ...(params as any).context,
          ...context,
        } as {
          [K in keyof TContext]: ReturnType<
            typeof resource<ReturnType<TContext[K]> extends Retrievable<infer T> ? T : never, unknown>
          >;
        },
      };
    })
  );
};

export const Contextual = {
  withContext,
};
