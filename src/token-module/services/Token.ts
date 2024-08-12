import { isNil } from "ramda";
import { sign, verify } from "jsonwebtoken";
import { ForbiddenException } from "@nestjs/common";
import { CONFIG } from "src/config";
import { ITokenPayload } from "../types";

export class Token {
	static sign(payload: ITokenPayload): string {
		return sign(payload, CONFIG.JWT_SECRET, {
			expiresIn: "5d",
		});
	}

	static verify(token: string): ITokenPayload {
		const verifiedToken = verify(token, CONFIG.JWT_SECRET) as ITokenPayload;

		if (isNil(verifiedToken.id)) {
			throw new ForbiddenException();
		}

		return verifiedToken;
	}
}
