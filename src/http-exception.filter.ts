import {
	ExceptionFilter,
	Catch,
	ArgumentsHost,
	InternalServerErrorException,
	NotFoundException,
} from "@nestjs/common";
import { FastifyReply } from "fastify";
import { GlobalResponseDto } from "./response-transform.interceptor";
import { BusinessError } from "./exceptions";

@Catch(Error)
export class HttpExceptionFilter implements ExceptionFilter {
	constructor() {}

	catch(exception: Error, host: ArgumentsHost) {
		const response = host.switchToHttp().getResponse<FastifyReply>();

		console.log(exception);

		const isNotFound = exception instanceof NotFoundException;
		const isBusiness = !isNotFound && exception instanceof BusinessError;

		try {
			return response
				.status(isBusiness ? 400 : isNotFound ? 404 : 500)
				.send(
					GlobalResponseDto.fromContext(
						host,
						{},
						isBusiness
							? [exception]
							: [new InternalServerErrorException()],
					),
				);
		} catch {
			return response.status(500).send();
		}
	}
}
