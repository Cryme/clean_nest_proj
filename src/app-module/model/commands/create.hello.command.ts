import { ok } from "src/common";
import { AggregateCommand, CommandResult } from "src/aggregate";
import {
	CreateHelloAggregateParams,
	IHelloRepository,
} from "../interfaces";
import { HelloAggregate } from "../domain";

export class CreateHelloCommand extends AggregateCommand<
	IHelloRepository,
	CreateHelloAggregateParams,
	HelloAggregate
> {
	async execute(): CommandResult<HelloAggregate> {
		const event = await this.repository.create(this.params);

		return ok(event);
	}
}
