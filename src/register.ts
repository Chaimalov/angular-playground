import { SignalStoreFeature, SignalStoreFeatureResult } from '@ngrx/signals';
import { SetupFeatureResult } from './layers/create-layer-model';

export type RegisterMethod = {
  <F1 extends SignalStoreFeatureResult>(id: string, f1: SignalStoreFeature<SetupFeatureResult, F1>): void;
  <F1 extends SignalStoreFeatureResult, F2 extends SignalStoreFeatureResult>(
    id: string,
    f1: SignalStoreFeature<SetupFeatureResult, F1>,
    f2: SignalStoreFeature<SetupFeatureResult & F1, F2>
  ): void;
  <F1 extends SignalStoreFeatureResult, F2 extends SignalStoreFeatureResult, F3 extends SignalStoreFeatureResult>(
    id: string,
    f1: SignalStoreFeature<SetupFeatureResult, F1>,
    f2: SignalStoreFeature<SetupFeatureResult & F1, F2>,
    f3: SignalStoreFeature<SetupFeatureResult & F1 & F2, F3>
  ): void;
  <
    F1 extends SignalStoreFeatureResult,
    F2 extends SignalStoreFeatureResult,
    F3 extends SignalStoreFeatureResult,
    F4 extends SignalStoreFeatureResult,
  >(
    id: string,
    f1: SignalStoreFeature<SetupFeatureResult, F1>,
    f2: SignalStoreFeature<SetupFeatureResult & F1, F2>,
    f3: SignalStoreFeature<SetupFeatureResult & F1 & F2, F3>,
    f4: SignalStoreFeature<SetupFeatureResult & F1 & F2 & F3, F4>
  ): void;
  <
    F1 extends SignalStoreFeatureResult,
    F2 extends SignalStoreFeatureResult,
    F3 extends SignalStoreFeatureResult,
    F4 extends SignalStoreFeatureResult,
    F5 extends SignalStoreFeatureResult,
  >(
    id: string,
    f1: SignalStoreFeature<SetupFeatureResult, F1>,
    f2: SignalStoreFeature<SetupFeatureResult & F1, F2>,
    f3: SignalStoreFeature<SetupFeatureResult & F1 & F2, F3>,
    f4: SignalStoreFeature<SetupFeatureResult & F1 & F2 & F3, F4>,
    f5: SignalStoreFeature<SetupFeatureResult & F1 & F2 & F3 & F4, F5>
  ): void;
  <
    F1 extends SignalStoreFeatureResult,
    F2 extends SignalStoreFeatureResult,
    F3 extends SignalStoreFeatureResult,
    F4 extends SignalStoreFeatureResult,
    F5 extends SignalStoreFeatureResult,
    F6 extends SignalStoreFeatureResult,
  >(
    id: string,
    f1: SignalStoreFeature<SetupFeatureResult, F1>,
    f2: SignalStoreFeature<SetupFeatureResult & F1, F2>,
    f3: SignalStoreFeature<SetupFeatureResult & F1 & F2, F3>,
    f4: SignalStoreFeature<SetupFeatureResult & F1 & F2 & F3, F4>,
    f5: SignalStoreFeature<SetupFeatureResult & F1 & F2 & F3 & F4, F5>,
    f6: SignalStoreFeature<SetupFeatureResult & F1 & F2 & F3 & F4 & F5, F6>
  ): void;
  <
    F1 extends SignalStoreFeatureResult,
    F2 extends SignalStoreFeatureResult,
    F3 extends SignalStoreFeatureResult,
    F4 extends SignalStoreFeatureResult,
    F5 extends SignalStoreFeatureResult,
    F6 extends SignalStoreFeatureResult,
    F7 extends SignalStoreFeatureResult,
  >(
    id: string,
    f1: SignalStoreFeature<SetupFeatureResult, F1>,
    f2: SignalStoreFeature<SetupFeatureResult & F1, F2>,
    f3: SignalStoreFeature<SetupFeatureResult & F1 & F2, F3>,
    f4: SignalStoreFeature<SetupFeatureResult & F1 & F2 & F3, F4>,
    f5: SignalStoreFeature<SetupFeatureResult & F1 & F2 & F3 & F4, F5>,
    f6: SignalStoreFeature<SetupFeatureResult & F1 & F2 & F3 & F4 & F5, F6>,
    f7: SignalStoreFeature<SetupFeatureResult & F1 & F2 & F3 & F4 & F5 & F6, F7>
  ): void;
  <
    F1 extends SignalStoreFeatureResult,
    F2 extends SignalStoreFeatureResult,
    F3 extends SignalStoreFeatureResult,
    F4 extends SignalStoreFeatureResult,
    F5 extends SignalStoreFeatureResult,
    F6 extends SignalStoreFeatureResult,
    F7 extends SignalStoreFeatureResult,
    F8 extends SignalStoreFeatureResult,
  >(
    id: string,
    f1: SignalStoreFeature<SetupFeatureResult, F1>,
    f2: SignalStoreFeature<SetupFeatureResult & F1, F2>,
    f3: SignalStoreFeature<SetupFeatureResult & F1 & F2, F3>,
    f4: SignalStoreFeature<SetupFeatureResult & F1 & F2 & F3, F4>,
    f5: SignalStoreFeature<SetupFeatureResult & F1 & F2 & F3 & F4, F5>,
    f6: SignalStoreFeature<SetupFeatureResult & F1 & F2 & F3 & F4 & F5, F6>,
    f7: SignalStoreFeature<SetupFeatureResult & F1 & F2 & F3 & F4 & F5 & F6, F7>,
    f8: SignalStoreFeature<SetupFeatureResult & F1 & F2 & F3 & F4 & F5 & F6 & F7, F8>
  ): void;
  <
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
    id: string,
    f1: SignalStoreFeature<SetupFeatureResult, F1>,
    f2: SignalStoreFeature<SetupFeatureResult & F1, F2>,
    f3: SignalStoreFeature<SetupFeatureResult & F1 & F2, F3>,
    f4: SignalStoreFeature<SetupFeatureResult & F1 & F2 & F3, F4>,
    f5: SignalStoreFeature<SetupFeatureResult & F1 & F2 & F3 & F4, F5>,
    f6: SignalStoreFeature<SetupFeatureResult & F1 & F2 & F3 & F4 & F5, F6>,
    f7: SignalStoreFeature<SetupFeatureResult & F1 & F2 & F3 & F4 & F5 & F6, F7>,
    f8: SignalStoreFeature<SetupFeatureResult & F1 & F2 & F3 & F4 & F5 & F6 & F7, F8>,
    f9: SignalStoreFeature<SetupFeatureResult & F1 & F2 & F3 & F4 & F5 & F6 & F7 & F8, F9>
  ): void;
  <
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
    id: string,
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
  ): void;
};
