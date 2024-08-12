import { Module } from "@nestjs/common";
import { OrmModule } from "../orm-module";
import {
	EventController,
} from "./api";
import {
	HelloService,
} from "./services";
import { HelloRepositoryPrisma } from "./infrastructure";
import { IHelloRepository } from "./model";

@Module({
	imports: [OrmModule],
	controllers: [
		EventController,
	],
	providers: [
		HelloService,
		{
			provide: IHelloRepository,
			useClass: HelloRepositoryPrisma,
		},
	],
})
export class AppModule {}
