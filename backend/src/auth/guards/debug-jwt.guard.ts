import { type CanActivate, type ExecutionContext, Injectable, Logger, UnauthorizedException } from "@nestjs/common";
import type { ConfigService } from "@nestjs/config";
import type { JwtService } from "@nestjs/jwt";
import { Request } from "express";

@Injectable()
export class DebugJwtGuard implements CanActivate {
  private readonly logger = new Logger(DebugJwtGuard.name, { timestamp: true });

  constructor(
    private jwtService: JwtService,
    private configService: ConfigService
  ) {
    this.logger.log("DebugJwtGuard 构造函数执行，JWT服务和Config服务已注入");
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    // 详细记录请求信息
    this.logger.log("🔍 DebugJwtGuard: 开始处理请求");
    this.logger.log(`🔍 请求详情: ${request.method} ${request.url}`);
    this.logger.log(`🔍 请求头完整列表: ${JSON.stringify(Object.keys(request.headers))}`);

    // 检查Authorization头
    const authHeader = request.headers.authorization;
    this.logger.log(`🔍 Authorization头: ${authHeader ? authHeader : "不存在"}`);

    // 检查是否存在 Authorization 头
    if (!authHeader) {
      this.logger.error("❌ DebugJwtGuard: 未找到 Authorization 头");
      throw new UnauthorizedException("未找到授权令牌");
    }

    // 检查 Authorization 头格式
    this.logger.log(`🔍 解析Authorization头: ${authHeader}`);
    const parts = authHeader.split(" ");
    this.logger.log(`🔍 Authorization头拆分结果: 类型=${parts[0]}, 令牌部分=${parts[1] ? "存在" : "不存在"}`);

    if (parts[0] !== "Bearer" || !parts[1]) {
      this.logger.error("❌ DebugJwtGuard: Authorization 头格式错误", { bearer: parts[0], token: parts[1] });
      throw new UnauthorizedException("授权令牌格式错误");
    }

    const token = parts[1];
    this.logger.log(`🔍 提取到的令牌: ${token.substring(0, 20)}...${token.substring(token.length - 5)}`);

    try {
      // 强制使用固定密钥以确保一致性
      const secret = "family-finance-secret-key";
      this.logger.log(`🔍 开始验证JWT令牌，使用固定密钥: family-finance-secret-key`);
      const payload = this.jwtService.verify(token, {
        secret,
        ignoreExpiration: true,
      });

      // 记录成功验证的payload
      this.logger.log("✅ DebugJwtGuard: JWT 验证成功!");
      this.logger.log(`✅ Payload内容: ${JSON.stringify(payload)}`);

      request.user = { userId: payload.sub, username: payload.username };
      this.logger.log(`✅ 用户信息已附加到请求对象: userId=${payload.sub}, username=${payload.username}`);
      return true;
    } catch (error) {
      this.logger.error("❌ DebugJwtGuard: JWT 验证失败!");
      this.logger.error(`❌ 错误类型: ${error.name}`);
      this.logger.error(`❌ 错误消息: ${error.message}`);
      throw new UnauthorizedException("无效的授权令牌");
    }
  }
}
