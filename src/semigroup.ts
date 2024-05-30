import { Semigroup } from "fp-ts/lib/Semigroup";
import { Ord as ordNumber, SemigroupSum, SemigroupProduct } from 'fp-ts/number'
import { min, max } from 'fp-ts/Semigroup'
import { struct } from 'fp-ts/Semigroup'
import { getSemigroup } from 'fp-ts/function'
import { SemigroupAll } from "fp-ts/lib/boolean";
import { concatAll } from 'fp-ts/Semigroup'


const semigroupSum: Semigroup<number> = {
	concat: (x, y) => x + y
}

const semigroupProduct: Semigroup<number> = {
	concat: (x, y) => x * y
}

const semigroupString: Semigroup<string> = {
	concat: (x, y) => x + y
}

// concatenate array
function getArraySemigroup<A = never>(): Semigroup<Array<A>> {
	return { concat: (x, y) => x.concat(y) }
}


/** Takes the minimum of two values */
const semigroupMin: Semigroup<number> = min(ordNumber)

/** Takes the maximum of two values  */
const semigroupMax: Semigroup<number> = max(ordNumber)

semigroupMin.concat(2, 1) // 1
semigroupMax.concat(2, 1) // 2

type Point = {
	x: number
	y: number
}


const semigroupPoint: Semigroup<Point> = struct({
	x: semigroupSum,
	y: semigroupSum
})

/** `semigroupAll` is the boolean semigroup under conjunction */
const semigroupPredicate: Semigroup<(p: Point) => boolean> = getSemigroup(SemigroupAll)()

const isPositiveX = (p: Point): boolean => p.x >= 0
const isPositiveY = (p: Point): boolean => p.y >= 0
const isPositiveXY = semigroupPredicate.concat(isPositiveX, isPositiveY)
// f: (p: Point) => boolean
// g: (p: Point) => boolean
// h: (p: Point) => f(p) && g(p)
isPositiveXY({ x: 1, y: 1 }) // true
isPositiveXY({ x: 1, y: -1 }) // false
isPositiveXY({ x: -1, y: 1 }) // false
isPositiveXY({ x: -1, y: -1 }) // false


const sum = concatAll(SemigroupSum)(0)

sum([1, 2, 3, 4]) // 10

const product = concatAll(SemigroupProduct)(1)

product([1, 2, 3, 4]) // 24
