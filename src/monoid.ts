import { getApplicativeMonoid } from "fp-ts/lib/Applicative";
import { Monoid, getStructMonoid, struct } from "fp-ts/lib/Monoid";
import { concatAll } from 'fp-ts/Monoid'
import { some, none, Applicative, Option } from 'fp-ts/Option'
import { first, last } from 'fp-ts/Semigroup'
import { getMonoid } from 'fp-ts/Option'


const monoidSum: Monoid<number> = {
	concat: (x, y) => x + y,
	empty: 0
}

const monoidProduct: Monoid<number> = {
	concat: (x, y) => x * y,
	empty: 1
}

const monoidString: Monoid<string> = {
	concat: (x, y) => x + y,
	empty: ""
}

const monoidAll: Monoid<boolean> = {
	concat: (x, y) => x && y,
	empty: true
}

const monoidAny: Monoid<boolean> = {
	concat: (x, y) => x || y,
	empty: false
}

type Point = {
	x: number,
	y: number
}

const monoidPoint: Monoid<Point> = getStructMonoid({
	x: monoidSum,
	y: monoidSum
})

concatAll(monoidSum)([1, 2, 3, 4]) // 10
concatAll(monoidProduct)([1, 2, 3, 4]) // 24
concatAll(monoidString)(['a', 'b', 'c']) // 'abc'
concatAll(monoidAll)([true, false, true]) // false
concatAll(monoidAny)([true, false, true]) // true

const M = getApplicativeMonoid(Applicative)(monoidSum)

M.concat(some(1), none) // none
M.concat(some(1), some(2)) // some(3)
M.concat(some(1), M.empty) // some(1)

const _M = getMonoid(first<number>())
_M.concat(some(1), none) // some(1)
_M.concat(some(1), some(2)) // some(1)

/** VSCode settings */
interface Settings {
	/** Controls the font family */
	fontFamily: Option<string>
	/** Controls the font size in pixels */
	fontSize: Option<number>
	/** Limit the width of the minimap to render at most a certain number of columns. */
	maxColumn: Option<number>
}

const monoidSettings: Monoid<Settings> = struct<Settings>({
	fontFamily: getMonoid(last<string>()),
	fontSize: getMonoid(last<number>()),
	maxColumn: getMonoid(last<number>()),
})

const workspaceSettings: Settings = {
	fontFamily: some('Courier'),
	fontSize: none,
	maxColumn: some(80)
}

const userSettings: Settings = {
	fontFamily: some('Fira Code'),
	fontSize: some(12),
	maxColumn: none
}

// last monoidを使ってあるtypeからsomeの値を優先的にとってこれる
// value || defaultValueみたいに書かなくてよくとてもスマート
monoidSettings.concat(workspaceSettings, userSettings)
/*
{ fontFamily: some("Fira Code"),
	fontSize: some(12),
	maxColumn: some(80) }
*/
