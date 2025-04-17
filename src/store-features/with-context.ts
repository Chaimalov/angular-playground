import { resource } from '@angular/core';
import { signalStoreFeature, SignalStoreFeatureResult, type, withProps } from '@ngrx/signals';
import { Observable } from 'rxjs';
import { Store } from '../layers/create-layer-model';
import { resolveResource, Retrievable } from './utils';

export type Context = Record<string, Observable<unknown>>;

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
      return {
        context: {
          ...(params as any).context,
          ...provider(params),
        } as {
          [K in keyof TContext]: TContext[K];
        },
      };
    })
  );
};

export const Contextual = {
  withContext,
};
