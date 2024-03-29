import type { Equal, Expect } from '@type-challenges/utils'

/**
 * 参考：https://github.com/type-challenges/type-challenges/issues/11761
 */
type DistributeUnions<T> = T extends unknown[]
  ? DistributeArray<T>
  : T extends object
    ? Merge<DistributeObject<T>>
    : T

/**
 * 分解数组里的联合类型
 */
type DistributeArray<A extends unknown[]> = A extends [infer H, ...infer T]
  ? ArrHelper<DistributeUnions<H>, T>
  : []

type ArrHelper<H, T extends unknown[]> = H extends H ? [H, ...DistributeArray<T>] : never

/**
 * 分解对象里的联合类型
 */
type DistributeObject<O extends object, K extends keyof O = keyof O> = [K] extends [never]
  ? {}
  : K extends K
    ? ObjHelper<K, DistributeUnions<O[K]>> & DistributeObject<Omit<O, K>>
    : never

type ObjHelper<K, V> = V extends V ? { [k in K & string]: V } : never

type Merge<O> = { [K in keyof O]: O[K] }

type cases = [
  // Already distributed unions should stay the same:
  Expect<Equal<DistributeUnions<1>, 1>>,
  Expect<Equal<DistributeUnions<string>, string>>,
  Expect<Equal<DistributeUnions<1 | 2>, 1 | 2>>,
  Expect<Equal<DistributeUnions<'b' | { type: 'a' } | [1]>, 'b' | { type: 'a' } | [1]>>,
  // tuples:
  Expect<Equal<DistributeUnions<[1 | 2, 3]>, [1, 3] | [2, 3]>>,
  Expect<Equal<DistributeUnions<[1 | 2, 'a' | 'b']>, [1, 'a'] | [1, 'b'] | [2, 'a'] | [2, 'b']>>,
  Expect<
  Equal<
  DistributeUnions<[1 | 2, 'a' | 'b', false | true]>,
  | [1, 'a', false]
  | [1, 'a', true]
  | [1, 'b', false]
  | [1, 'b', true]
  | [2, 'a', false]
  | [2, 'a', true]
  | [2, 'b', false]
  | [2, 'b', true]
  >
  >,
  // objects
  Expect<
  Equal<
  DistributeUnions<{ x: 'a' | 'b'; y: 'c' | 'd' }>,
  { x: 'a'; y: 'c' } | { x: 'a'; y: 'd' } | { x: 'b'; y: 'c' } | { x: 'b'; y: 'd' }
  >
  >,
  Expect<
  Equal<
  DistributeUnions<{ type: 'a'; value: number | string } | { type: 'b'; value: boolean }>,
  | { type: 'a'; value: string }
  | { type: 'a'; value: number }
  | { type: 'b'; value: false }
  | { type: 'b'; value: true }
  >
  >,
  Expect<
  Equal<
  DistributeUnions<
  | {
    type: 'a'
    option: { kind: 'none' } | { kind: 'some'; value: 'x' | 'y' }
  }
  | { type: 'b'; msg: string }
  >,
  | { type: 'b'; msg: string }
  | { type: 'a'; option: { kind: 'none' } }
  | { type: 'a'; option: { kind: 'some'; value: 'x' } }
  | { type: 'a'; option: { kind: 'some'; value: 'y' } }
  >
  >,
  // mixed structures:
  Expect<
  Equal<
  DistributeUnions<[false | true, { value: 'a' | 'b' }, { x: { y: 2 | 3 } }]>,
  | [false, { value: 'a' }, { x: { y: 2 } }]
  | [false, { value: 'a' }, { x: { y: 3 } }]
  | [false, { value: 'b' }, { x: { y: 2 } }]
  | [false, { value: 'b' }, { x: { y: 3 } }]
  | [true, { value: 'a' }, { x: { y: 2 } }]
  | [true, { value: 'a' }, { x: { y: 3 } }]
  | [true, { value: 'b' }, { x: { y: 2 } }]
  | [true, { value: 'b' }, { x: { y: 3 } }]
  >
  >,
  Expect<
  Equal<
  DistributeUnions<17 | [10 | { value: 'a' | 'b' }, { x: { y: 2 | 3 } }]>,
  | 17
  | [10, { x: { y: 2 } }]
  | [10, { x: { y: 3 } }]
  | [{ value: 'a' }, { x: { y: 2 } }]
  | [{ value: 'a' }, { x: { y: 3 } }]
  | [{ value: 'b' }, { x: { y: 2 } }]
  | [{ value: 'b' }, { x: { y: 3 } }]
  >
  >,
]
