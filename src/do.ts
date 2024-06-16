import { pipe } from 'fp-ts/function'
import * as T from 'fp-ts/Task'

declare const print: (s: string) => T.Task<void>
declare const readLine: T.Task<string>

const mainDo: T.Task<{ x: string; y: string }> = pipe(
	T.Do, // alias for IO.of({})
	// const bind: <"x", {}, string>(name: "x", f: (a: {}) => T.Task<string>) => (ma: T.Task<{}>) => T.Task<{
	//     readonly x: string; <- {}に値を詰めて返す
	// }>
	T.bind('x', () => readLine),
	T.bind('y', () => readLine),
	T.apS('z', readLine),
	T.tap(({ x }) => print(x)),
	T.tap(({ y }) => print(y)),
	T.tap(({ z }) => print(z))
)
