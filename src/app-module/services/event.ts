import { Inject, Injectable } from "@nestjs/common";
import {
	IHelloRepository,
	HelloQuery, CreateHelloCommand,
} from "../model";
import { ApiHello } from "../api/types";

@Injectable()
export class HelloService {
	constructor(
		@Inject(IHelloRepository)
		private readonly repository: IHelloRepository,
	) {}

	async getHello(params: {
		id: string;
	}): Promise<ApiHello> {
		const query = new HelloQuery(this.repository, params);

		return query.execute().then((v) => ApiHello.from(v.unwrap()));
	}

	async createHello(params: {
		title: string;
	}): Promise<ApiHello> {
		const command = new CreateHelloCommand(this.repository, params);

		return command.execute().then((v) => ApiHello.from(v.unwrap()));
	}
}
