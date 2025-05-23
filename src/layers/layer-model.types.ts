import { Type } from '@angular/core';
import { Prettify, signalStore, StateSource } from '@ngrx/signals';
import { of } from 'rxjs';
import { Lifecycle, Table, Visuals } from '../store-features';
import { createLayerModelBlock, requiredFeatures } from './create-layer-model';

const BaseLayer = signalStore(
  requiredFeatures(),
  createLayerModelBlock(Lifecycle.withSetup(), Lifecycle.withCleanup())
);

const PotentialLayer = signalStore(
  requiredFeatures(),
  createLayerModelBlock(
    Table.withColumns(() => of([])),
    Table.withRows(() => of([])),
    Visuals.withImage(() => of('')),
    Visuals.withLabel(() => of({ name: '', color: '' })),
    Lifecycle.withCleanup()
  )
);

/**
 * Represents the data and behavior of a layer.
 *
 * Layer models are used by the layer store to manage layers.
 * To create custom layer models, use the `createLayerModel` function
 * and add your specific properties and behavior.
 *
 * @see createLayerModelBlock
 */
export type LayerModel = Type<
  Prettify<
    Omit<InstanceType<typeof BaseLayer> & Partial<InstanceType<typeof PotentialLayer>>, keyof StateSource<object>>
  >
>;
