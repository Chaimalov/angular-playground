import {
  EmptyFeatureResult,
  Prettify,
  SignalStoreFeature,
  signalStoreFeature,
  SignalStoreFeatureResult,
  type,
} from '@ngrx/signals';
import { Lifecycle, PrettifyFeatureResult } from '../store-features';

export const requiredFeatures = () => signalStoreFeature(Lifecycle.withSetup(), Lifecycle.withCleanup());

export type SetupFeatureResult =
  ReturnType<typeof requiredFeatures> extends SignalStoreFeature<EmptyFeatureResult, infer S> ? S : EmptyFeatureResult;

export type Store<Input extends SignalStoreFeatureResult> = Prettify<
  Input['props'] & Input['state'] & Input['methods']
>;

export function createLayerModelBlock<F1 extends SignalStoreFeatureResult>(
  f1: SignalStoreFeature<SetupFeatureResult, F1>
): SignalStoreFeature<SetupFeatureResult, F1>;
export function createLayerModelBlock<F1 extends SignalStoreFeatureResult, F2 extends SignalStoreFeatureResult>(
  f1: SignalStoreFeature<SetupFeatureResult, F1>,
  f2: SignalStoreFeature<SetupFeatureResult & F1, F2>
): SignalStoreFeature<SetupFeatureResult, PrettifyFeatureResult<F1 & F2>>;
export function createLayerModelBlock<
  F1 extends SignalStoreFeatureResult,
  F2 extends SignalStoreFeatureResult,
  F3 extends SignalStoreFeatureResult,
>(
  f1: SignalStoreFeature<SetupFeatureResult, F1>,
  f2: SignalStoreFeature<SetupFeatureResult & F1, F2>,
  f3: SignalStoreFeature<SetupFeatureResult & F1 & F2, F3>
): SignalStoreFeature<SetupFeatureResult, PrettifyFeatureResult<F1 & F2 & F3>>;
export function createLayerModelBlock<
  F1 extends SignalStoreFeatureResult,
  F2 extends SignalStoreFeatureResult,
  F3 extends SignalStoreFeatureResult,
  F4 extends SignalStoreFeatureResult,
>(
  f1: SignalStoreFeature<SetupFeatureResult, F1>,
  f2: SignalStoreFeature<SetupFeatureResult & F1, F2>,
  f3: SignalStoreFeature<SetupFeatureResult & F1 & F2, F3>,
  f4: SignalStoreFeature<SetupFeatureResult & F1 & F2 & F3, F4>
): SignalStoreFeature<SetupFeatureResult, PrettifyFeatureResult<F1 & F2 & F3 & F4>>;
export function createLayerModelBlock<
  F1 extends SignalStoreFeatureResult,
  F2 extends SignalStoreFeatureResult,
  F3 extends SignalStoreFeatureResult,
  F4 extends SignalStoreFeatureResult,
  F5 extends SignalStoreFeatureResult,
>(
  f1: SignalStoreFeature<SetupFeatureResult, F1>,
  f2: SignalStoreFeature<SetupFeatureResult & F1, F2>,
  f3: SignalStoreFeature<SetupFeatureResult & F1 & F2, F3>,
  f4: SignalStoreFeature<SetupFeatureResult & F1 & F2 & F3, F4>,
  f5: SignalStoreFeature<SetupFeatureResult & F1 & F2 & F3 & F4, F5>
): SignalStoreFeature<SetupFeatureResult, PrettifyFeatureResult<F1 & F2 & F3 & F4 & F5>>;
export function createLayerModelBlock<
  F1 extends SignalStoreFeatureResult,
  F2 extends SignalStoreFeatureResult,
  F3 extends SignalStoreFeatureResult,
  F4 extends SignalStoreFeatureResult,
  F5 extends SignalStoreFeatureResult,
  F6 extends SignalStoreFeatureResult,
>(
  f1: SignalStoreFeature<SetupFeatureResult, F1>,
  f2: SignalStoreFeature<SetupFeatureResult & F1, F2>,
  f3: SignalStoreFeature<SetupFeatureResult & F1 & F2, F3>,
  f4: SignalStoreFeature<SetupFeatureResult & F1 & F2 & F3, F4>,
  f5: SignalStoreFeature<SetupFeatureResult & F1 & F2 & F3 & F4, F5>,
  f6: SignalStoreFeature<SetupFeatureResult & F1 & F2 & F3 & F4 & F5, F6>
): SignalStoreFeature<SetupFeatureResult, PrettifyFeatureResult<F1 & F2 & F3 & F4 & F5 & F6>>;
export function createLayerModelBlock<
  F1 extends SignalStoreFeatureResult,
  F2 extends SignalStoreFeatureResult,
  F3 extends SignalStoreFeatureResult,
  F4 extends SignalStoreFeatureResult,
  F5 extends SignalStoreFeatureResult,
  F6 extends SignalStoreFeatureResult,
  F7 extends SignalStoreFeatureResult,
>(
  f1: SignalStoreFeature<SetupFeatureResult, F1>,
  f2: SignalStoreFeature<SetupFeatureResult & F1, F2>,
  f3: SignalStoreFeature<SetupFeatureResult & F1 & F2, F3>,
  f4: SignalStoreFeature<SetupFeatureResult & F1 & F2 & F3, F4>,
  f5: SignalStoreFeature<SetupFeatureResult & F1 & F2 & F3 & F4, F5>,
  f6: SignalStoreFeature<SetupFeatureResult & F1 & F2 & F3 & F4 & F5, F6>,
  f7: SignalStoreFeature<SetupFeatureResult & F1 & F2 & F3 & F4 & F5 & F6, F7>
): SignalStoreFeature<SetupFeatureResult, PrettifyFeatureResult<F1 & F2 & F3 & F4 & F5 & F6 & F7>>;
export function createLayerModelBlock<
  F1 extends SignalStoreFeatureResult,
  F2 extends SignalStoreFeatureResult,
  F3 extends SignalStoreFeatureResult,
  F4 extends SignalStoreFeatureResult,
  F5 extends SignalStoreFeatureResult,
  F6 extends SignalStoreFeatureResult,
  F7 extends SignalStoreFeatureResult,
  F8 extends SignalStoreFeatureResult,
>(
  f1: SignalStoreFeature<SetupFeatureResult, F1>,
  f2: SignalStoreFeature<SetupFeatureResult & F1, F2>,
  f3: SignalStoreFeature<SetupFeatureResult & F1 & F2, F3>,
  f4: SignalStoreFeature<SetupFeatureResult & F1 & F2 & F3, F4>,
  f5: SignalStoreFeature<SetupFeatureResult & F1 & F2 & F3 & F4, F5>,
  f6: SignalStoreFeature<SetupFeatureResult & F1 & F2 & F3 & F4 & F5, F6>,
  f7: SignalStoreFeature<SetupFeatureResult & F1 & F2 & F3 & F4 & F5 & F6, F7>,
  f8: SignalStoreFeature<SetupFeatureResult & F1 & F2 & F3 & F4 & F5 & F6 & F7, F8>
): SignalStoreFeature<SetupFeatureResult, PrettifyFeatureResult<F1 & F2 & F3 & F4 & F5 & F6 & F7 & F8>>;
export function createLayerModelBlock<
  F1 extends SignalStoreFeatureResult,
  F2 extends SignalStoreFeatureResult,
  F3 extends SignalStoreFeatureResult,
  F4 extends SignalStoreFeatureResult,
  F5 extends SignalStoreFeatureResult,
  F6 extends SignalStoreFeatureResult,
  F7 extends SignalStoreFeatureResult,
  F8 extends SignalStoreFeatureResult,
  F9 extends SignalStoreFeatureResult,
>(
  f1: SignalStoreFeature<SetupFeatureResult, F1>,
  f2: SignalStoreFeature<SetupFeatureResult & F1, F2>,
  f3: SignalStoreFeature<SetupFeatureResult & F1 & F2, F3>,
  f4: SignalStoreFeature<SetupFeatureResult & F1 & F2 & F3, F4>,
  f5: SignalStoreFeature<SetupFeatureResult & F1 & F2 & F3 & F4, F5>,
  f6: SignalStoreFeature<SetupFeatureResult & F1 & F2 & F3 & F4 & F5, F6>,
  f7: SignalStoreFeature<SetupFeatureResult & F1 & F2 & F3 & F4 & F5 & F6, F7>,
  f8: SignalStoreFeature<SetupFeatureResult & F1 & F2 & F3 & F4 & F5 & F6 & F7, F8>,
  f9: SignalStoreFeature<SetupFeatureResult & F1 & F2 & F3 & F4 & F5 & F6 & F7 & F8, F9>
): SignalStoreFeature<SetupFeatureResult, PrettifyFeatureResult<F1 & F2 & F3 & F4 & F5 & F6 & F7 & F8 & F9>>;
export function createLayerModelBlock<
  F1 extends SignalStoreFeatureResult,
  F2 extends SignalStoreFeatureResult,
  F3 extends SignalStoreFeatureResult,
  F4 extends SignalStoreFeatureResult,
  F5 extends SignalStoreFeatureResult,
  F6 extends SignalStoreFeatureResult,
  F7 extends SignalStoreFeatureResult,
  F8 extends SignalStoreFeatureResult,
  F9 extends SignalStoreFeatureResult,
  F10 extends SignalStoreFeatureResult,
>(
  f1: SignalStoreFeature<SetupFeatureResult, F1>,
  f2: SignalStoreFeature<SetupFeatureResult & F1, F2>,
  f3: SignalStoreFeature<SetupFeatureResult & F1 & F2, F3>,
  f4: SignalStoreFeature<SetupFeatureResult & F1 & F2 & F3, F4>,
  f5: SignalStoreFeature<SetupFeatureResult & F1 & F2 & F3 & F4, F5>,
  f6: SignalStoreFeature<SetupFeatureResult & F1 & F2 & F3 & F4 & F5, F6>,
  f7: SignalStoreFeature<SetupFeatureResult & F1 & F2 & F3 & F4 & F5 & F6, F7>,
  f8: SignalStoreFeature<SetupFeatureResult & F1 & F2 & F3 & F4 & F5 & F6 & F7, F8>,
  f9: SignalStoreFeature<SetupFeatureResult & F1 & F2 & F3 & F4 & F5 & F6 & F7 & F8, F9>,
  f10: SignalStoreFeature<SetupFeatureResult & F1 & F2 & F3 & F4 & F5 & F6 & F7 & F8 & F9, F10>
): SignalStoreFeature<SetupFeatureResult, PrettifyFeatureResult<F1 & F2 & F3 & F4 & F5 & F6 & F7 & F8 & F9 & F10>>;

/**
 * Creates a signal store feature that combines multiple features into one.
 *
 * Each feature passed in will be added to the resulting feature, and the state will be combined
 * into a single state object. The order of the features is important, as the state of each feature
 * will be added to the state object in the order they are passed in.
 *
 * @param features - The features to combine
 * @returns A signal store feature that combines the features
 */
export function createLayerModelBlock(...features: [SignalStoreFeature<SetupFeatureResult>]) {
  return signalStoreFeature(type<SetupFeatureResult>(), ...features);
}
