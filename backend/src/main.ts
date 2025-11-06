import { ValidationPipe, Logger } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { AppModule } from "./app.module";

async function bootstrap() {
  // 创建应用实例并设置日志级别
  const app = await NestFactory.create(AppModule, {
    logger: ['error', 'warn', 'log', 'debug', 'verbose'],
  });
  
  Logger.log('应用已启动，日志级别：debug');

  // 启用CORS
  app.enableCors({
    origin: "http://localhost:5173", // Vite默认端口
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"], // 明确允许Authorization头
  });

  // 全局验证管道
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    })
  );

  // 配置Swagger文档
  const config = new DocumentBuilder()
    .setTitle("家庭记账本 API")
    .setDescription("家庭记账本后端服务API文档")
    .setVersion("1.0.0")
    .addBearerAuth(
      {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
        in: "header",
        name: "Authorization",
      },
      "access_token"
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("api", app, document);

  const port = process.env.PORT || 3001;
  await app.listen(port);

  console.log(`🚀 后端服务已启动: http://localhost:${port}`);
  console.log(`📚 Swagger文档地址: http://localhost:${port}/api`);
}

bootstrap();
