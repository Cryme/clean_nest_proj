import { Global, Module } from "@nestjs/common";
import { AuthGuard } from "./guards/AuthGuard";
import { RequestTokenPayload } from "./services/RequestTokenPayload";
import { Token } from "./services/Token";

export { RequestTokenPayload, AuthGuard, Token };

export * from "./types";

@Global()
@Module({
	providers: [RequestTokenPayload],
	exports: [RequestTokenPayload],
})
export class TokenModule {}
