// Practical Guide to Fp-ts P4: Arrays, Semigroups, Monoids
// https://rlee.dev/practical-guide-to-fp-ts-part-4?source=more_series_bottom_blogs
import * as A from 'fp-ts/lib/Array'
import * as O from 'fp-ts/lib/Option'
import { pipe } from 'fp-ts/lib/function'

const foo = [1, 2, 3, 4, 5]

const sum = pipe(
	A.Functor.map(foo, (x) => x - 1),
  A.filter((x) => x % 2 === 0),
  A.reduce(0, (prev, next) => prev + next),
)
console.log(sum) // 6

const bar = ['a', 'b', 'c']
const zipped = pipe(foo, A.zip(bar))
console.log(zipped) // [[1, 'a], [2, 'b], [3, 'c']]

const arr = [1,2,3].map(O.of)
const a = A.array.sequence(O.option)(arr)
const b = O.sequenceArray(arr)
O.getOrElse
