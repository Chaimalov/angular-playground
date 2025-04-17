import { signalStoreFeature, SignalStoreFeatureResult, type, withProps, withState } from '@ngrx/signals';
import { Observable } from 'rxjs';
import { Store } from '../layers/create-layer-model';

export const withColumns = <Params extends SignalStoreFeatureResult>(
  provider: (params: Store<Params>) => Observable<string[]>
) => {
  return signalStoreFeature(
    type<Params>(),
    withState(() => ({
      sort: [] as string[],
    })),
    withProps(params => {
      return {
        tableColumns: provider(params),
      };
    })
  );
};

export const withRows = <Params extends SignalStoreFeatureResult>(
  provider: (params: Store<Params>) => Observable<Array<Record<string, string>>>
) => {
  return signalStoreFeature(
    type<Params>(),
    withProps(params => {
      return {
        tableRows: provider(params),
      };
    })
  );
};

export const Table = {
  withRows,
  withColumns,
};
