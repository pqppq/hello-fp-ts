import { Either, left, right, mapLeft, getApplicativeValidation } from 'fp-ts/Either'
import { pipe } from 'fp-ts/function'
import { chain } from 'fp-ts/Either'
import { NonEmptyArray, getSemigroup } from 'fp-ts/NonEmptyArray'
import { sequenceT } from 'fp-ts/Apply'
import { map } from 'fp-ts/Either'

const minLength = (s: string): Either<string, string> =>
	s.length >= 6 ? right(s) : left('at least 6 characters')

const oneCapital = (s: string): Either<string, string> =>
	/[A-Z]/g.test(s) ? right(s) : left('at least one capital letter')

const oneNumber = (s: string): Either<string, string> =>
	/[0-9]/g.test(s) ? right(s) : left('at least one number')


const validatePassword = (s: string): Either<string, string> =>
  // pipes the value of an expression into a pipeline of functions.
	pipe(
		minLength(s),
		chain(oneCapital),
		chain(oneNumber)
	)


console.log(validatePassword('ab'))
// => left("at least 6 characters")

console.log(validatePassword('abcdef'))
// => left("at least one capital letter")

console.log(validatePassword('Abfdef'))
// => left("at least one number")


function lift<E, A>(check: (a: A) => Either<E, A>): (a: A) => Either<NonEmptyArray<E>, A> {
	return a =>
		pipe(
			check(a),
			// left値を配列にして返す
			mapLeft(a => [a])
		)
}

const minLengthV = lift(minLength)
const oneCapitalV = lift(oneCapital)
const oneNumberV = lift(oneNumber)


function validatePassword2(s: string): Either<NonEmptyArray<string>, string> {
	return pipe(
		sequenceT(getApplicativeValidation(getSemigroup<string>()))(
			minLengthV(s),
			oneCapitalV(s),
			oneNumberV(s)
		),
		map(() => s) // to Either
	)
}
console.log(validatePassword2('ab'))
// => left(["at least 6 characters", "at least one capital letter", "at least one number"])
