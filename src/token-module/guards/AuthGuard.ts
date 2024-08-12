import { Injectable, CanActivate, ExecutionContext } from "@nestjs/common";
import { last } from "ramda";
import { Request } from "express";
import { BadTokenException } from "src/exceptions";
import { Nullable } from "src/common";
import { Token } from "../services/Token";

@Injectable()
export class AuthGuard implements CanActivate {
	canActivate(context: ExecutionContext): boolean {
		const request: Request = context.switchToHttp().getRequest();

		const token = this.getToken(request);

		if (!token) {
			throw new BadTokenException();
		}

		try {
			return Boolean(Token.verify(token));
		} catch {
			throw new BadTokenException();
		}
	}

	private getToken(request: Request): Nullable<string> {
		const authorization = request.headers["authorization"];

		if (!authorization || Array.isArray(authorization)) {
			return null;
		}

		return last(authorization.split(" ")) ?? null;
	}
}
