import { Eq } from "fp-ts/lib/Eq";
import { getStructEq } from 'fp-ts/Eq'
import { getEq } from 'fp-ts/Array'
import { contramap } from 'fp-ts/Eq'

const eqNumber: Eq<number> = {
	equals: (x, y) => x === y
}

function elem<A>(E: Eq<A>): (a: A, arr: Array<A>) => boolean {
	return (a, arr) => arr.some(item => E.equals(item, a))
}

elem(eqNumber)(1, [1, 2, 3])

type Point = {
	x: number
	y: number
}

// const eqPoint: Eq<Point> = {
// 	equals: (p1, p2) => p1 === p2 || (p1.x === p2.x && p1.y === p2.y)
// }
const eqPoint: Eq<Point> = getStructEq({
	x: eqNumber,
	y: eqNumber
})

type Vector = {
	from: Point
	to: Point
}

const eqVector: Eq<Vector> = getStructEq({
	from: eqPoint,
	to: eqPoint
})

const eqArrayOfPoints: Eq<Array<Point>> = getEq(eqPoint)

type User = {
	userId: number
	name: string
}

// userIdが等価かどうかチェックする
const eqUser = contramap((user: User) => user.userId)(eqNumber)
eqUser.equals({ userId: 1, name: 'Giulio' }, { userId: 1, name: 'Giulio Canti' }) // true
