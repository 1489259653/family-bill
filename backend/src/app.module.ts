import { Module, NestModule, MiddlewareConsumer, Logger } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AuthModule } from "./auth/auth.module";
import { FamiliesModule } from "./families/families.module";
import { TransactionsModule } from "./transactions/transactions.module";
import { UsersModule } from "./users/users.module";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [() => ({
        nest: {
          logger: ['error', 'warn', 'log', 'debug', 'verbose'],
        },
      })],
    }),
    TypeOrmModule.forRoot({
      type: "mysql",
      host: process.env.DB_HOST || "localhost",
      port: parseInt(process.env.DB_PORT) || 3306,
      username: process.env.DB_USERNAME || "root",
      password: process.env.DB_PASSWORD || "",
      database: process.env.DB_DATABASE || "family_finance",
      entities: [__dirname + "/**/*.entity{.ts,.js}"],
      synchronize: process.env.NODE_ENV !== "production",
    }),
    AuthModule,
    UsersModule,
    TransactionsModule,
    FamiliesModule,
  ],
})export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    // 确保日志级别设置正确
    Logger.log('应用日志级别已配置：error, warn, log, debug, verbose');
  }
}
