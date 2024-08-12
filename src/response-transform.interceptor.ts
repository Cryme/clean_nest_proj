import {
	ArgumentsHost,
	CallHandler,
	ExecutionContext,
	Injectable,
	NestInterceptor,
} from "@nestjs/common";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import * as pckg from "../package.json";
import { asyncLocalStorage } from "./common";

export interface Response<T> {
	data: T;
}

@Injectable()
export class TransformInterceptor<T>
	implements NestInterceptor<T, Response<T>>
{
	intercept(
		context: ExecutionContext,
		next: CallHandler,
	): Observable<Response<T>> {
		return next.handle().pipe(
			map((data) => {
				return GlobalResponseDto.fromContext(context, data);
			}),
		);
	}
}

export class MetaDto {
	public errors: string[];
	path: string;
	body: string;
	traceId: string;
	ip: string;

	timestamp: number;
	serverVersion: string;
}

export class GlobalResponseDto<T> {
	static fromContext<T>(
		context: ArgumentsHost,
		data?: T,
		exceptions?: Error[],
	): GlobalResponseDto<T> {
		const res = new GlobalResponseDto<T>();
		const request = context.switchToHttp().getRequest();

		res.data = data;
		const exceptionsData: string[] = [];

		if (exceptions) {
			exceptions.forEach((err) => {
				exceptionsData.push(err.message);
			});
		}

		const t: any = asyncLocalStorage.getStore();

		res.meta = {
			errors: exceptionsData,
			path: request.url,
			body: request.body,
			traceId: t === undefined ? "-" : t["traceId"],
			ip: request.ip,
			timestamp: new Date().getTime(),
			serverVersion: pckg.version,
		};

		return res;
	}

	public data: T | void;
	public meta: MetaDto;
}
