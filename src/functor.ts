import { Functor1 } from "fp-ts/lib/Functor"

const URI = 'Response'
type URI = typeof URI

interface _Response<A> {
	url: string
	status: number
	headers: Record<string, string>
	body: A
}

declare module 'fp-ts/HKT' {
	interface URItoKind<A> {
		Response: _Response<A>
	}
}

function map<A, B>(fa: _Response<A>, f: (a: A) => B): _Response<B> {
	return { ...fa, body: f(fa.body) }
}

const functorResponse: Functor1<URI> = {
	URI,
	map }
