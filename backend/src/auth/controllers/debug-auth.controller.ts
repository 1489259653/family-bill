import { Controller, Get, Logger, UseGuards } from "@nestjs/common";
import type { JwtService } from "@nestjs/jwt";
import { AuthGuard } from "@nestjs/passport";
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { DebugJwtGuard } from "../guards/debug-jwt.guard";

@ApiTags("调试认证")
@Controller("debug-auth")
export class DebugAuthController {
  private readonly logger = new Logger(DebugAuthController.name);

  constructor(private jwtService: JwtService) {}

  // 生成测试用的JWT令牌
  @Get("generate-token")
  @ApiOperation({ summary: "生成测试用的JWT令牌" })
  generateTestToken() {
    this.logger.log("生成测试JWT令牌");

    // 创建测试payload
    const payload = {
      sub: "1",
      username: "testuser",
      email: "test@example.com",
      iat: Math.floor(Date.now() / 1000),
      test: true,
    };

    // 使用与JwtStrategy相同的密钥生成令牌
    const token = this.jwtService.sign(payload, {
      secret: "family-finance-secret-key",
      expiresIn: "1h",
    });

    this.logger.log(`成功生成测试令牌: ${token.substring(0, 20)}...`);

    return {
      token,
      payload,
      message: "使用密钥 family-finance-secret-key 生成的测试令牌",
      instructions: "使用此令牌作为 Bearer token 测试其他端点",
    };
  }

  @Get("test")
  @ApiOperation({ summary: "使用自定义调试守卫测试 JWT 认证" })
  @ApiResponse({ status: 200, description: "认证成功" })
  @ApiResponse({ status: 401, description: "认证失败" })
  @ApiBearerAuth("access_token")
  @UseGuards(DebugJwtGuard)
  testAuth() {
    return {
      message: "认证成功！",
      timestamp: new Date().toISOString(),
    };
  }

  // 使用Passport的JWT守卫，这样可以测试JwtStrategy
  @Get("test-passport")
  @ApiOperation({ summary: "使用Passport的JWT守卫测试 JWT 认证" })
  @ApiResponse({ status: 200, description: "认证成功" })
  @ApiResponse({ status: 401, description: "认证失败" })
  @ApiBearerAuth("access_token")
  @UseGuards(AuthGuard("jwt"))
  testPassportAuth() {
    return {
      message: "Passport JWT守卫认证成功!",
      timestamp: new Date().toISOString(),
    };
  }
}
