import { Option, some, none, option, isNone, chain } from 'fp-ts/Option'
import { head } from 'fp-ts/Array'
import { pipe } from 'fp-ts/lib/function'

const inverse = (n: number): Option<number> => (n === 0 ? none : some(1 / n))

const inverseHead: Option<number> = pipe(head([1, 2, 3]), chain(inverse))

console.log(inverseHead);
