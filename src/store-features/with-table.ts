import { resource } from '@angular/core';
import { signalStoreFeature, withProps, withState } from '@ngrx/signals';
import { resolveResource, Retrievable } from './utils';

const TABLE_ROWS = Symbol('table rows');
const TABLE_COLUMNS = Symbol('table columns');

export const withColumns = <Params>(
  provider: (params: Params) => Retrievable<string[]>
) => {
  return signalStoreFeature(
    withState(() => ({
      sort: [] as string[],
    })),
    withProps(params => {
      const columnsResource = resource({
        request: () => provider(params as Params),
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

export const withRows = <Params>(
  provider: (
    params: Params
  ) => Retrievable<Array<Record<string, string>> | undefined>
) => {
  return signalStoreFeature(
    withProps(params => {
      const rowsResource = resource({
        request: () => provider(params as Params),
        stream: resolveResource,
      });

      return {
        [TABLE_ROWS]: rowsResource,
        tableRows: rowsResource.asReadonly(),
      };
    })
  );
};
