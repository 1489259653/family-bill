import type { INestApplication } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { Logger } from "@nestjs/common";

export interface InitSwaggerOptions {
  app: INestApplication;
  configService: ConfigService;
}

export function initSwagger(options: InitSwaggerOptions): void {
  const { app, configService } = options;
  const logger = new Logger('Swagger');
  
  try {
    // 从环境变量读取配置
    const enabled = configService.get<string>("SWAGGER_ENABLED") === "true";
    const title = configService.get<string>("SWAGGER_TITLE", "家庭记账本 API");
    const description = configService.get<string>("SWAGGER_DESCRIPTION", "家庭记账本后端服务API文档");
    const version = configService.get<string>("SWAGGER_VERSION", "1.0.0");
    
    if (!enabled) {
      logger.log('Swagger文档已禁用（通过环境变量配置）');
      return;
    }
    
    // 配置Swagger文档
    const swaggerOptions = new DocumentBuilder()
      .setTitle(title)
      .setDescription(description)
      .setVersion(version)
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
      
    const document = SwaggerModule.createDocument(app, swaggerOptions);
    SwaggerModule.setup("api", app, document, {
      jsonDocumentUrl: "/swagger/json",
      swaggerOptions: {
        persistAuthorization: true
      }
    });
    
    logger.log(`Swagger文档已启用，访问地址: http://localhost:${process.env.PORT || 3001}/api`);
  } catch (error) {
    logger.error('Swagger文档初始化失败', error);
  }
}