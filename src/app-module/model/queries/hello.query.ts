import { AggregateQuery, QueryResult } from "src/aggregate";
import { IHelloRepository } from "../interfaces";
import { err, ok } from "src/common";
import { HelloAggregate } from "../domain";

export class HelloQuery extends AggregateQuery<
	IHelloRepository,
	{
		id: string;
	},
	HelloAggregate
> {
	async execute(): QueryResult<HelloAggregate> {
		const aggregate = await this.repository.find(this.params.id);

		if (!aggregate) {
			return err("not_found");
		}

		return ok(aggregate);
	}
}
