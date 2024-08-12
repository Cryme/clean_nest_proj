import { isNil } from "ramda";
import { Err, Ok, Result } from "./common";
import { BusinessError } from "./exceptions";
import { InternalServerErrorException } from "@nestjs/common";

const isAggregate = <T>(v: Aggregate<T>): v is Aggregate<T> => {
	return v instanceof Aggregate;
};

export abstract class Aggregate<T> {
	protected readonly _id: string;
	protected _props: T;
	protected _wasChanged: boolean = false;

	constructor(props: T, id: string) {
		this._id = id;
		this._props = props;
	}

	get id(): string {
		return this._id;
	}

	get props(): T {
		return this._props;
	}

	get wasChanged(): boolean {
		return this._wasChanged;
	}

	public equals(object?: Aggregate<T>): boolean {
		if (isNil(object)) {
			return false;
		}

		if (this === object) {
			return true;
		}

		if (!isAggregate(object)) {
			return false;
		}

		return this._id == object._id;
	}
}

export abstract class AggregateQuery<
	Rep extends IAggregateRepository<any>,
	P,
	R,
> {
	repository: Rep;
	params: P;

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	constructor(repository: Rep, params: P) {
		this.repository = repository;
		this.params = params;
	}

	abstract execute(): QueryResult<R>;
}

export abstract class AggregateCommand<
	Rep extends IAggregateRepository<any>,
	P,
	R,
> {
	repository: Rep;
	params: P;

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	constructor(repository: Rep, params: P) {
		this.repository = repository;
		this.params = params;
	}

	abstract execute(): CommandResult<R>;
}

export interface IAggregateRepository<T> {
	save(aggregate: Aggregate<T>): Promise<Aggregate<T>>;
}

export async function saveIfNeeded<T, R extends IAggregateRepository<T>>(
	aggregate: Aggregate<T>,
	repository: R,
): Promise<Aggregate<T>> {
	if (aggregate.wasChanged) {
		return repository.save(aggregate);
	}

	return aggregate;
}

export type QueryResult<T> = Promise<Result<T, string>>;

export type CommandErrorInfo = {
	details?: string;
	isBusiness: boolean;
};

export type CommandError =
	| "member_not_exists"
	| "participant_not_exists"
	| "leader_not_exists"
	| "invite_cant_be_used"
	| "member_already_exists"
	| "unauthorized"
	| "bad_request"
	| "";

export const CommandErrors: Record<CommandError, CommandErrorInfo> = {
	member_not_exists: {
		isBusiness: true,
	},
	participant_not_exists: {
		isBusiness: true,
	},
	leader_not_exists: {
		isBusiness: true,
	},
	invite_cant_be_used: {
		isBusiness: true,
	},
	member_already_exists: {
		isBusiness: false,
	},
	unauthorized: {
		isBusiness: true,
	},
	bad_request: {
		isBusiness: true,
	},

	"": {
		isBusiness: false,
	},
};

class CommandErr extends Err<CommandError> {
	//TODO: Logs
	/**
	 * If result is **Err** throws *BusinessError* or *InternalServerErrorException*
	 */
	unwrap(): never {
		if (CommandErrors[this.error].isBusiness) {
			throw new BusinessError(this.error);
		}

		throw new InternalServerErrorException();
	}
}

export type CommandResult<T> = Promise<Ok<T> | CommandErr>;
