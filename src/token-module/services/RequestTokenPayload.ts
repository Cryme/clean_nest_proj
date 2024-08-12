import { REQUEST } from "@nestjs/core";
import { isNil } from "ramda";
import { Request } from "express";
import { ForbiddenException, Inject, Injectable } from "@nestjs/common";
import { Token } from "./Token";
import { ITokenPayload } from "../types";

@Injectable()
export class RequestTokenPayload {
	constructor(@Inject(REQUEST) private readonly request: Request) {}

	getPayload(): ITokenPayload & { token: string } {
		const token = this.request.headers["authorization"];

		if (isNil(token)) {
			throw new ForbiddenException();
		}

		return {
			token,
			...Token.verify(token),
		};
	}
}
