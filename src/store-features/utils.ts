import {
  computed,
  ResourceLoaderParams,
  ResourceStreamItem,
  signal,
  Signal,
} from '@angular/core';
import { fromEvent, isObservable, Observable, takeUntil } from 'rxjs';

export async function resolveResource<
  R extends ResourceLoaderParams<Retrievable<unknown>>,
  T = R extends ResourceLoaderParams<Retrievable<infer L>> ? L : never,
>({ request, abortSignal }: R): Promise<Signal<ResourceStreamItem<T>>> {
  if (isObservable(request)) {
    const stream = signal<ResourceStreamItem<T>>({ value: undefined as T });
    const { promise, resolve } =
      Promise.withResolvers<Signal<ResourceStreamItem<T>>>();
    (request as Observable<T>)
      .pipe(takeUntil(fromEvent(abortSignal, 'abort')))
      .subscribe({
        next: value => {
          stream.set({ value });
          resolve(stream);
        },
        error: error => {
          stream.set({ error });
          resolve(stream);
        },
      });

    return promise;
  }

  if (typeof request === 'function') {
    try {
      return signal({
        value: await request(abortSignal),
      });
    } catch (error) {
      return signal({ error });
    }
  }

  return signal({ value: request as T });
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

export type Retrievable<T> =
  | Exclude<T, Function>
  | ((abortSignal: AbortSignal) => Promise<T>)
  | Observable<T>;

export type TupleToIntersect<T extends any[]> = T extends [
  infer First,
  ...infer Rest,
]
  ? First & TupleToIntersect<Rest>
  : {};

export type Prettify<T extends {}> = {
  [K in keyof T]: T[K];
} & NonNullable<unknown>;

export type UnionToIntersection<U> = (
  U extends any ? (k: U) => void : never
) extends (k: infer I) => void
  ? I
  : never;

export type UnionToOvlds<U> = UnionToIntersection<
  U extends any ? (f: U) => void : never
>;

export type PopUnion<U> =
  UnionToOvlds<U> extends (a: infer A) => void ? A : never;

export type IsUnion<T> = [T] extends [UnionToIntersection<T>] ? false : true;

export type UnionToArray<T, A extends unknown[] = []> =
  IsUnion<T> extends true
    ? UnionToArray<Exclude<T, PopUnion<T>>, [PopUnion<T>, ...A]>
    : [T, ...A];
