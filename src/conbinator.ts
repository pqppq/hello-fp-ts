import { IO, Monad } from 'fp-ts/IO'
import { Monoid } from 'fp-ts/Monoid'
import { concatAll } from 'fp-ts/Monoid'
import { replicate } from 'fp-ts/ReadonlyArray'
import { now } from 'fp-ts/Date'
import { log } from 'fp-ts/Console'

export function getMonoid<A>(M: Monoid<A>): Monoid<IO<A>> {
	return {
		// x, y: IO<A>
		concat: (x, y) => () => M.concat(x(), y()),
		empty: () => M.empty
	}
}

/** a primitive `Monoid` instance for `void` */
export const monoidVoid: Monoid<void> = {
	concat: () => undefined,
	empty: undefined
}

export function replicateIO(n: number, mv: IO<void>): IO<void> {
	const ioVoidMonoid = getMonoid(monoidVoid)
	// voidのmonoidをrepeatして、concatAll経由でまとめて実行できる
	return concatAll(ioVoidMonoid)(replicate(n, mv))
}


export function time<A>(ma: IO<A>): IO<A> {
	return Monad.chain(now, (start) =>
		// chainするときにmaの中身が実行される
		Monad.chain(ma, (a) =>
			Monad.chain(now, (end) =>
				Monad.map(log(`Elapsed: ${end - start}`), () => a)
			)
		)
	)
}
