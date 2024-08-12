export class BusinessError extends Error {
	constructor(
		message?: string,
		readonly details?: string,
	) {
		super(message);
	}
}

export class BadRequestException extends BusinessError {
	message = "bad_request";
}
export class ForbiddenException extends BusinessError {
	message = "forbidden";
}
export class UnauthorizedException extends BusinessError {
	message = "unauthorized";
}
export class BadTokenException extends BusinessError {
	message = "bad_token";
}