// Practical Guide to Fp-ts P3: Task, Either, TaskEither
// https://rlee.dev/practical-guide-to-fp-ts-part-3?source=more_series_bottom_blogs

import * as E from 'fp-ts/Either'
import * as T from 'fp-ts/Task'
import * as TE from 'fp-ts/TaskEither'
import { flow } from 'fp-ts/lib/function'
import { createHash } from 'crypto'
import { absurd, constVoid, pipe, unsafeCoerce } from 'fp-ts/lib/function'

export class MinLengthValidationError extends Error {
	public _tag: 'PasswordMinLengthValidationError'

	public minLength: number

	private constructor(minLength: number) {
		super('password fails to meet min length requirement: ${minLength}')
		this._tag = 'PasswordMinLengthValidationError'
		this.minLength = minLength
	}

	public static of(minLength: number): MinLengthValidationError {
		return new MinLengthValidationError(minLength)
	}
}

export class CapitalLetterMissingValidationError extends Error {
	public _tag: 'PasswordCapitalLetterMissingValidationError'

	private constructor() {
		super(`password is missing a capital letter`)
		this._tag = 'PasswordCapitalLetterMissingValidationError'
	}

	public static of(): CapitalLetterMissingValidationError {
		return new CapitalLetterMissingValidationError()
	}
}

export type PasswordValidationError =
	| MinLengthValidationError
	| CapitalLetterMissingValidationError

export interface Password {
	_tag: 'Password'
	value: string
	isHashed: boolean
}

export function of(value: string): Password {
	return { _tag: 'Password', value, isHashed: false }
}

export function fromHashed(value: string): Password {
	return { _tag: 'Password', value, isHashed: true }
}

export type PasswordSpecification = {
	minLength?: number
	capitalLetterRequired?: boolean
}

export function validate({
	minLength = 0,
	capitalLetterRequired = false,
}: PasswordSpecification = {}) {
	return (password: Password): E.Either<PasswordValidationError, Password> => {
		if (password.value.length < minLength) {
			return E.left(MinLengthValidationError.of(minLength))
		}

		if (capitalLetterRequired && !/[A-Z]/.test(password.value)) {
			return E.left(CapitalLetterMissingValidationError.of())
		}

		return E.right({ ...password, isValidated: true })
	}
}

export type HashFn = (value: string) => string

export function hashPassword(hashFn: HashFn) {
	return (password: Password): Password => ({
		...password,
		value: hashFn(password.value),
		isHashed: true,
	})
}

const hashFunc = (value: string) => createHash('md5').update(value).digest('hex')

const pipeline = flow(
	of,
	validate({ minLength: 8, capitalLetterRequired: true }),
	E.map(hashPassword(hashFunc)),
)


let axios;
type Resp = { code: number; description: string }

const result = pipe(
  TE.tryCatch(
    () => axios.get('https://httpstat.us/200'),
    () => constVoid() as never,
  ),
  TE.map((resp) => unsafeCoerce<unknown, Resp>(resp.data)),
  TE.fold(absurd, T.of),
) // Not executing the promise

