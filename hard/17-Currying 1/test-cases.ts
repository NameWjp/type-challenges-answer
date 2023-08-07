import type { Equal, Expect } from '@type-challenges/utils'

declare function Currying<F>(fn: F): CurryingType<F>

type CurryingType<T> = T extends (...arg: infer P) => infer Result
  ? P extends [infer First, ...infer Rest]
    ? Rest['length'] extends 0
      ? T
      : (arg: First) => CurryingType<(...args: Rest) => Result>
    : T
  : never;

const curried1 = Currying((a: string, b: number, c: boolean) => true)
const curried2 = Currying((a: string, b: number, c: boolean, d: boolean, e: boolean, f: string, g: boolean) => true)
const curried3 = Currying(() => true)

type cases = [
  Expect<Equal<
    typeof curried1, (a: string) => (b: number) => (c: boolean) => true
  >>,
  Expect<Equal<
    typeof curried2, (a: string) => (b: number) => (c: boolean) => (d: boolean) => (e: boolean) => (f: string) => (g: boolean) => true
  >>,
  Expect<Equal<typeof curried3, () => true>>,
]
