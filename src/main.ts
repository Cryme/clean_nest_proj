import { NestFactory } from "@nestjs/core";
import { ValidationPipe } from "@nestjs/common";
import {
  FastifyAdapter,
  NestFastifyApplication,
} from "@nestjs/platform-fastify";
import { v4 as uuidv4 } from "uuid";
import { RootModule } from "./root.module";
import { PrismaService } from "./orm-module";
import { asyncLocalStorage } from "./common";
import { TransformInterceptor } from "./response-transform.interceptor";

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
      RootModule,
      new FastifyAdapter(),
  );

  const dbService: PrismaService = app.get(PrismaService);
  await dbService.enableShutdownHooks(app);

  app.enableCors({
    origin: (origin, callback) => {
      callback(null, true);
    },
    allowedHeaders: "*",
    methods: "*",
  });

  app.use(function (_req: any, _res: any, next: any) {
    const tid = uuidv4();
    asyncLocalStorage.run({ traceId: tid }, next);
  });

  app.useGlobalInterceptors(new TransformInterceptor());

  app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        disableErrorMessages: false,
        stopAtFirstError: true,
      }),
  );

  await app.listen(14088, () => {
    console.log(`Server listening on port ${14088}`);
  });
}

bootstrap();
