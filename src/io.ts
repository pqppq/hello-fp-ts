import { fromNullable, Option } from 'fp-ts/Option'
import { IO, io } from 'fp-ts/lib/IO'
import { toError } from 'fp-ts/Either'
import { IOEither, tryCatch } from 'fp-ts/IOEither'
import * as fs from 'fs'
import { ioEither } from 'fp-ts'
import { randomInt } from 'crypto'

// IO represents a computation that never fails

const getItem = (key: string): IO<Option<string>> => () =>
	fromNullable(localStorage.getItem(key))

const setItem = (key: string, value: string): IO<void> => () =>
	localStorage.setItem(key, value)


const random: IO<number> = () => Math.random()
const log = (s: unknown): IO<void> => () => console.log(s)

/** get a random boolean */
const randomBool: IO<boolean> = io.map(random, n => n < 0.5)
const program: IO<void> = io.chain(randomBool, log)


// error handling
const readFileSync = (path: string): IOEither<Error, string> =>
	tryCatch(() => fs.readFileSync(path, 'utf8'), toError)

readFileSync('foo')() // => left(Error: ENOENT: no such file or directory, open 'foo')
readFileSync(__filename)() // => right(...)
