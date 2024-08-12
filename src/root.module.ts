import { Module } from "@nestjs/common";
import { APP_FILTER } from "@nestjs/core";
import { OrmModule } from "./orm-module";
import { AppModule } from "./app-module";
import { TokenModule } from "./token-module";
import { HttpExceptionFilter } from "./http-exception.filter";

@Module({
	imports: [OrmModule, AppModule, TokenModule],
	controllers: [],
	providers: [
		{
			provide: APP_FILTER,
			useClass: HttpExceptionFilter,
		},
	],
})
export class RootModule {}
