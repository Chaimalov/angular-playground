import { resource } from '@angular/core';
import { signalStoreFeature, withProps } from '@ngrx/signals';
import { Retrievable, resolveResource } from './utils';

type Label = {
  name: string;
  color: string;
};

const LABEL_REF = Symbol('label');

export const withLabel = <Params>(
  provider: (params: Params) => Retrievable<Label | undefined>
) => {
  return signalStoreFeature(
    withProps(({ ...params }) => {
      const labelResource = resource({
        request: () => provider(params as Params),
        stream: resolveResource,
      });

      return {
        label: labelResource.asReadonly(),
        [LABEL_REF]: labelResource,
      };
    })
  );
};
