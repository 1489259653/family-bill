import { ValidationPipe, Logger } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { ConfigService } from "@nestjs/config";
import { AppModule } from "./app.module";
import { initSwagger } from "./swagger";

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

  // 获取配置服务
  const configService = app.get(ConfigService);
  
  // 初始化Swagger文档（通过环境变量控制启用）
  try {
    initSwagger({ app, configService });
  } catch (error) {
    Logger.warn('Swagger模块初始化失败：可能是开发依赖未安装');
  }

  const port = process.env.PORT || 3001;
  await app.listen(port);

  console.log(`🚀 后端服务已启动: http://localhost:${port}`);
  console.log(`📚 Swagger文档地址: http://localhost:${port}/api`);
}

bootstrap();
