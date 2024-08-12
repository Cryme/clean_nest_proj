import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/orm-module";
import {  Hello as PrismaHello } from "@prisma/client";
import { CreateHelloAggregateParams, IHelloRepository } from "../model";
import { HelloAggregate } from "../model";


@Injectable()
export class HelloRepositoryPrisma implements IHelloRepository {
	constructor(private readonly prismaService: PrismaService) {}

	async create(params: CreateHelloAggregateParams): Promise<HelloAggregate> {
		return this.prismaService.hello
			.create({
				data: {
					title: params.title,
				},
			})
			.then(mapFromPrisma);
	}

	async save(aggregate: HelloAggregate): Promise<HelloAggregate> {
		return this.prismaService.hello
			.update({
				where: {
					id: aggregate.id,
				},
				data: {
					...aggregate.props,
				},
			})
			.then(mapFromPrisma);
	}

	async find(id: string): Promise<HelloAggregate> {
		return this.prismaService.hello.findFirst({
			where: {
				id,
			}
		}).then(mapFromPrisma);
	}
}

function mapFromPrisma(
	v: PrismaHello
): HelloAggregate {
	return new HelloAggregate(
		{
			createdAt: v.createdAt,
			title: v.title,
		},
		v.id,
	);
}
