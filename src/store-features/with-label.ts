import { resource } from '@angular/core';
import { signalStoreFeature, withProps } from '@ngrx/signals';
import { Asset, resolveResource } from './utils';

type Label = {
  name: string;
  color: string;
};

const LABEL_REF = Symbol('label');

export const withLabel = <Params>(
  provider: (params: Params) => Asset<Label | undefined>
) => {
  return signalStoreFeature(
    withProps(({ ...params }) => {
      const labelResource = resource({
        request: () => provider(params as Params),
        loader: resolveResource,
      });

      return {
        label: labelResource.asReadonly(),
        [LABEL_REF]: labelResource,
      };
    })
  );
};
