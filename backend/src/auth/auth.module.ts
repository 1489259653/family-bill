import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";
import { UsersModule } from "../users/users.module";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { AuthTestController } from "./controllers/auth-test.controller";
import { DebugAuthController } from "./controllers/debug-auth.controller";
import { JwtStrategy } from "./strategies/jwt.strategy";

// 使用固定的密钥进行测试，确保生成和验证使用相同的密钥
const JWT_SECRET = process.env.JWT_SECRET || "family-finance-secret-key";

@Module({
  imports: [
    PassportModule,
    JwtModule.register({
      secret: JWT_SECRET,
      signOptions: { expiresIn: "7d" },
    }),
    UsersModule,
  ],
  controllers: [AuthController, AuthTestController, DebugAuthController],
  providers: [AuthService, JwtStrategy],
  exports: [AuthService],
})
export class AuthModule {}
