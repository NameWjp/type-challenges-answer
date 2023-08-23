import type { Equal, Expect } from '@type-challenges/utils'

type Data = {
  foo: {
    bar: {
      value: 'foobar'
      count: 6
    }
    included: true
  }
  'foo.baz': false
  hello: 'world'
}

type Get<T, S extends string> = S extends keyof T
  ? T[S]
  : S extends `${infer F}.${infer R}`
    ? F extends keyof T
      ? Get<T[F], R>
      : never
    : never

type cases = [
  Expect<Equal<Get<Data, 'hello'>, 'world'>>,
  Expect<Equal<Get<Data, 'foo.bar.count'>, 6>>,
  Expect<Equal<Get<Data, 'foo.bar'>, { value: 'foobar'; count: 6 }>>,
  Expect<Equal<Get<Data, 'foo.baz'>, false>>,
  Expect<Equal<Get<Data, 'no.existed'>, never>>,
]
