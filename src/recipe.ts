import { task, apply } from "fp-ts";
import * as O from "fp-ts/Option";
import { pipe, flow } from "fp-ts/function";
import { either, taskEither } from "fp-ts";

const value: O.Option<number> = O.some(1);

const add5 = (x: number) => x + 5;
const multiply2 = (x: number) => x * 2;

const one = multiply2(add5(3)); // Ok
const two = pipe(3, add5, multiply2); // Better

console.log(one, two); // 16, 16

const runPipe = (x: number) => pipe(x, add5);
const runFlow = flow(add5);

console.log(runPipe(3), runFlow(3)); // 8, 8


const deepThought: task.Task<number> = () => Promise.resolve(42);
deepThought().then((n) => {
	console.log(`The answer is ${n}.`);
});

// taks that may fail
const fetchGreeting = taskEither.tryCatch<Error, { name: string }>(
	() => new Promise((resolve) => resolve(JSON.parse('{ "name": "Carol" }'))),
	(reason) => new Error(String(reason))
);

fetchGreeting()
	.then((e) =>
		pipe(
			e,
			either.fold(
				(err) => `I'm sorry, I don't know who you are. (${err.message})`,
				(x) => `Hello, ${x.name}!`
			)
		)
	)
	.then(console.log);

// list of tasks in prallel
const tasks = [task.of(1), task.of(2)];
task.sequenceArray(tasks)().then(console.log); // [ 1, 2 ]


apply.sequenceT(task.ApplyPar)(task.of(1), task.of("hello")); // type is task.Task<[number, string]>
apply.sequenceS(task.ApplyPar)({ a: task.of(1), b: task.of("hello") }); // type is task.Task<{ a: number; b: string; }>


const checkPathExists = (path: string) => () =>
  new Promise((resolve) => {
    resolve({ path, exists: !path.startsWith('/no/') })
  });

const program = pipe(
  ["/bin", "/no/real/path"],
  task.traverseArray(checkPathExists)
)

program().then(console.log); // [ { path: '/bin', exists: true }, { path: '/no/real/path', exists: false } ]
