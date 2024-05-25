import { Option, none, some, fromNullable } from "fp-ts/Option"
import * as fs from "fs"
import { Either, tryCatch } from "fp-ts/Either"
import { IO } from "fp-ts/IO"
import { IOEither, tryCatch as iOEitherTryCatch } from "fp-ts/IOEither"
import { createInterface } from "readline"
import { Task } from "fp-ts/Task"
import { TaskEither, tryCatch as taskEitherTryCatch } from "fp-ts/TaskEither"

// sentinels
// usecase: something that may fail
function findIndex<A>(as: Array<A>, predicate: (a: A) => boolean): Option<number> {
	const index = as.findIndex(predicate)
	return index === -1 ? none : some(index)
}

function find<A>(as: Array<A>, predicate: (a: A) => boolean): Option<A> {
	// construct a new Optional from a nullable type
	return fromNullable(as.find(predicate))
}

function parse(s: string): Either<Error, unknown> {
	// try-catchのエラーハンドリングを分離して書けて読みやすい
	return tryCatch(
		() => JSON.parse(s), // LazyArg<any>
		(reason) => new Error(String(reason))) // orThrow: (e: unknown) => Error
}

// usecase: something that returns a non deterministic value
const random: IO<number> = () => Math.random()

// synchronous side effects
// somethins that reads and/or writes to a global state
function getItem(key: string): IO<Option<string>> {
	return () => fromNullable(localStorage.getItem(key))
}

function readFileSync(path: string): IOEither<Error, string> {
	return iOEitherTryCatch(
		() => fs.readFileSync(path, "utf8"),
		(reason) => new Error(String(reason))
	)
}

// asynchronous side effects
// create type () => Promise<A>
const read: Task<string> = () =>
	new Promise<string>((resolve) => {
		const rl = createInterface({
			input: process.stdin,
			output: process.stdout
		})
		rl.question('', (answer) => {
			rl.close()
			resolve(answer)
		})
	})

function get(url: string): TaskEither<Error, string> {
	return taskEitherTryCatch(
		() => fetch(url).then((res) => res.text()),
		(reason) => new Error(String(reason)))
}
