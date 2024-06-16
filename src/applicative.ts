import { flatten } from 'fp-ts/Array'
import { HKT } from 'fp-ts/HKT'
import { Apply } from 'fp-ts/Apply'

const applicativeArray = {
	map: <A, B>(fa: Array<A>, f: (a: A) => B): Array<B> => fa.map(f),
	// <A>(a: A) =>  HKT<F, A>
	of: <A>(a: A): Array<A> => [a],
	ap: <A, B>(fab: Array<(a: A) => B>, fa: Array<A>): Array<B> =>
		flatten(fab.map(f => fa.map(f)))
}


type Curried2<B, C, D> = (b: B) => (c: C) => D

function liftA2<F>(
	F: Apply<F>
): <B, C, D>(g: Curried2<B, C, D>) => Curried2<HKT<F, B>, HKT<F, C>, HKT<F, D>> {
	return g => fb => fc => F.ap(F.map(fb, g), fc)
}
