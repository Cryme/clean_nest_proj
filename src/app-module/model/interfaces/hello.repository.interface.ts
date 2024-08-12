import { HelloAggregate } from "../domain";

export interface IHelloRepository {
	create(params: CreateHelloAggregateParams): Promise<HelloAggregate>;
	save(aggregate: HelloAggregate): Promise<HelloAggregate>;
	find(id: string): Promise<HelloAggregate>;
}

export type CreateHelloAggregateParams = {
	title: string;
};

export const IHelloRepository = Symbol("IHelloRepository");
