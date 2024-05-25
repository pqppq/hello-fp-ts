import { Ord, fromCompare } from "fp-ts/lib/Ord";
import { reverse } from 'fp-ts/Ord'

const ordNumber: Ord<number> = {
	equals: (x, y) => x === y,
	compare: (x, y) => (x < y ? -1 : x > y ? 1 : 0)
}

// fromCompare
// const ordNumber: Ord<number> = fromCompare((x, y) => (x < y ? -1 : x > y ? 1 : 0))

function min<A>(O: Ord<A>): (x: A, y: A) => A {
	return (x, y) => (O.compare(x, y) === 1 ? y : x)
}

min(ordNumber)(2, 1) // 1

type User = {
	name: string
	age: number
}

const byAge: Ord<User> = fromCompare((x, y) => ordNumber.compare(x.age, y.age))
const getYounger = min(byAge)

getYounger({ name: 'Guido', age: 48 }, { name: 'Giulio', age: 45 }) // { name: 'Giulio', age: 45 }


function max<A>(O: Ord<A>): (x: A, y: A) => A {
	return min(reverse(O))
}

const getOlder = max(byAge)

getOlder({ name: 'Guido', age: 48 }, { name: 'Giulio', age: 45 }) // { name: 'Guido', age: 48 }
