import { resource } from '@angular/core';
import { signalStoreFeature, withProps } from '@ngrx/signals';
import { resolveResource, Asset } from './utils';

const TABLE_ROWS = Symbol('table rows');
const TABLE_COLUMNS = Symbol('table columns');

export const withColumns = <Params>(
  provider: (params: Params) => Asset<string[]>
) => {
  return signalStoreFeature(
    withProps(params => {
      const columnsResource = resource({
        request: () => provider(params as Params),
        loader: resolveResource,
      });

      return {
        [TABLE_COLUMNS]: columnsResource,
        tableColumns: columnsResource.asReadonly(),
      };
    })
  );
};

export const withRows = <Params>(
  provider: (params: Params) => Asset<Array<Record<string, string>> | undefined>
) => {
  return signalStoreFeature(
    withProps(params => {
      const rowsResource = resource({
        request: () => provider(params as Params),
        loader: resolveResource,
      });

      return {
        [TABLE_ROWS]: rowsResource,
        tableRows: rowsResource.asReadonly(),
      };
    })
  );
};
