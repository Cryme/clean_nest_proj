import { Body, Controller, Get, Post, Query } from "@nestjs/common";
import { RequestTokenPayload } from "src/token-module";
import { HelloService } from "../services";
import { ApiHello, CreateHello, Id } from "./types";

@Controller("/")
export class EventController {
	constructor(
		private readonly requestTokenPayload: RequestTokenPayload,
		private readonly helloService: HelloService,
	) {}

	@Get("/")
	async getParticipantEvents(
		@Query() query: Id,
	): Promise<ApiHello> {
		return this.helloService.getHello(query);
	}

	@Post("/")
	async createHello(
		@Body() body: CreateHello,
	): Promise<ApiHello> {
		const payload = this.requestTokenPayload.getPayload();

		return this.helloService.createHello(body);
	}
}
