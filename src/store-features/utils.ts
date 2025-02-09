import {
  computed,
  ResourceLoaderParams,
  ResourceStatus,
  Signal,
} from '@angular/core';

export async function resolveResource<
  R extends ResourceLoaderParams<any>,
  T = R extends ResourceLoaderParams<Asset<infer L>> ? L : never,
>({ request, abortSignal, previous }: R): Promise<T | undefined> {
  if (previous.status === ResourceStatus.Idle) {
    return undefined;
  }
  return typeof request === 'function'
    ? (request as (...args: any[]) => Promise<T>)(abortSignal)
    : request;
}

type LazyResourceRequest<T> = {
  request: () => T;
  activeSignal?: Signal<boolean>;
};

declare let isActive: Signal<boolean> | undefined;
export function lazyRequest<T>({
  request,
  activeSignal,
}: LazyResourceRequest<T>) {
  let _isActive = computed(() => isActive?.() || activeSignal?.() || false);

  if (!_isActive()) return;

  return (function () {
    let isActive = _isActive;

    return request();
  })();
}

export type Asset<T> =
  | Exclude<T, Function>
  | ((abortSignal: AbortSignal) => Promise<T>);

export type TupleToIntersect<T extends any[]> = T extends [
  infer First,
  ...infer Rest,
]
  ? First & TupleToIntersect<Rest>
  : {};

export type Prettify<T extends {}> = {
  [K in keyof T]: T[K];
} & NonNullable<unknown>;
