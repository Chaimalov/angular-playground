import { resource, Signal } from '@angular/core';
import { signalStoreFeature, SignalStoreFeatureResult, type, withProps, withState } from '@ngrx/signals';
import { resolveResource, Retrievable } from './utils';
import { Store } from '../layers/create-layer-model';

const TABLE_ROWS = Symbol('table rows');
const TABLE_COLUMNS = Symbol('table columns');

export const withColumns = <Params extends SignalStoreFeatureResult>(
  provider: (params: Store<Params>) => Retrievable<string[]>
) => {
  return signalStoreFeature(
    type<Params>(),
    withState(() => ({
      sort: [] as string[],
    })),
    withProps(params => {
      const columnsResource = resource({
        request: () => provider(params),
        stream: resolveResource,
        // loader: resolveResource,
      });

      return {
        [TABLE_COLUMNS]: columnsResource,
        tableColumns: columnsResource.asReadonly(),
      };
    })
  );
};

export const withRows = <Params extends SignalStoreFeatureResult>(
  provider: (params: Store<Params>) => Retrievable<Array<Record<string, string>> | undefined>
) => {
  return signalStoreFeature(
    type<Params>(),
    withProps(params => {
      const rowsResource = resource({
        request: () => provider(params),
        stream: resolveResource,
      });

      return {
        [TABLE_ROWS]: rowsResource,
        tableRows: rowsResource.asReadonly(),
      };
    })
  );
};

export const Table = {
  withRows,
  withColumns,
};
