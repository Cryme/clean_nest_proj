import { IsString } from "class-validator";
import { HelloAggregate } from "../model";

export class Id {
	@IsString()
	id: string
}

export class CreateHello {
	@IsString()
	title: string
}

export class ApiHello {
	id: string;
	title: string;
	createdAt: Date;

	static from(aggregate: HelloAggregate): ApiHello {
		return {
			id: aggregate.id,
			title: aggregate.title,
			createdAt: aggregate.props.createdAt,
		}
	}
}