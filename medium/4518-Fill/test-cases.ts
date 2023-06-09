import type { Equal, Expect } from '@type-challenges/utils'

/**
 * 注意这里的 Flag 每次递归不传的话都会去判断
 * 参考答案：https://github.com/type-challenges/type-challenges/issues/14102
 */
type Fill<
  T extends unknown[],
  O,
  Start extends number = 0,
  End extends number = T['length'],
  Index extends unknown[] = [],
  Flag extends boolean = Index['length'] extends Start ? true : false
> = Index['length'] extends End
  ? T
  : T extends [infer First, ...infer Rest]
    ? Flag extends true
      ? [O, ...Fill<Rest, O, Start, End, [...Index, 0], Flag>]
      : [First, ...Fill<Rest, O, Start, End, [...Index, 0]>]
    : T

type cases = [
  Expect<Equal<Fill<[], 0>, []>>,
  Expect<Equal<Fill<[], 0, 0, 3>, []>>,
  Expect<Equal<Fill<[1, 2, 3], 0, 0, 0>, [1, 2, 3]>>,
  Expect<Equal<Fill<[1, 2, 3], 0, 2, 2>, [1, 2, 3]>>,
  Expect<Equal<Fill<[1, 2, 3], 0>, [0, 0, 0]>>,
  Expect<Equal<Fill<[1, 2, 3], true>, [true, true, true]>>,
  Expect<Equal<Fill<[1, 2, 3], true, 0, 1>, [true, 2, 3]>>,
  Expect<Equal<Fill<[1, 2, 3], true, 1, 3>, [1, true, true]>>,
  Expect<Equal<Fill<[1, 2, 3], true, 10, 0>, [1, 2, 3]>>,
  Expect<Equal<Fill<[1, 2, 3], true, 10, 20>, [1, 2, 3]>>,
  Expect<Equal<Fill<[1, 2, 3], true, 0, 10>, [true, true, true]>>,
]
