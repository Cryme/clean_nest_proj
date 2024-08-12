import { isNil } from "ramda";
import { AsyncLocalStorage } from "async_hooks";

export const asyncLocalStorage = new AsyncLocalStorage();

export type Nullable<T> = T | null;

export type Mutable<T> = {
	-readonly [k in keyof T]: T[k];
};

export class Ok<T> {
	readonly isOk: true;
	readonly isErr: false;

	constructor(readonly value: T) {
		this.isOk = true;
		this.isErr = false;
	}

	/**
	 * If result is **Err** throws *UnwrapException*
	 */
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	unwrap(_?: string): T {
		return this.value;
	}
}

export class UnwrapException extends Error {}

export class Err<E> {
	readonly isOk: false;
	readonly isErr: true;

	constructor(readonly error: E) {
		this.isOk = false;
		this.isErr = true;
	}

	/**
	 * If result is **Err** throws *UnwrapException*
	 */
	unwrap(message?: string): never {
		throw new UnwrapException(
			isNil(message) ? (this.error as any) : message,
		);
	}
}

export type Result<T, E> = Ok<T> | Err<E>;
export type SimpleResult = Result<"", "">;

export function ok<T>(value: T): Ok<T> {
	return new Ok<T>(value);
}

export function err<E>(error: E): Err<E> {
	return new Err<E>(error);
}

export function impossible(): never {
	throw new Error("Impossible Exception");
}
