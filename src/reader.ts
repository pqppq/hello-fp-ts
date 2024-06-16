// const f = (b: boolean): string => (b ? 'true' : 'false')

// const g = (n: number): string => f(n > 2)

// const h = (s: string): string => g(s.length + 1)

import { pipe  } from 'fp-ts/function'
import { ask, chain, Reader } from 'fp-ts/Reader'
// Reader<R, A> -> (r: R) => A

interface Dependencies {
	i18n: {
		true: string
		false: string
	},
	lowerBound: number
}

const instance: Dependencies = {
	i18n: {
		true: 'vero',
		false: 'falso'
	},
	lowerBound: 2
}
const f = (b: boolean): Reader<Dependencies, string> => deps => (b ? deps.i18n.true : deps.i18n.false)

const g = (n: number): Reader<Dependencies, string> => f(n > 2)

const h = (s: string): Reader<Dependencies, string> => g(s.length + 1)

console.log(h('foo')(instance)) // 'vero'
console.log(h('foo')) // 'true'

const gg = (n : number): Reader<Dependencies, string> => pipe(
	// read the current context
	ask<Dependencies>(),
	chain(deps => f(n > deps.lowerBound))
)
