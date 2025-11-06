import { Injectable, Logger, type OnModuleInit } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";

// 立即输出日志以确认类被加载
console.log("🔍 JwtStrategy 类被加载!");

// 使用固定的密钥进行测试，确保生成和验证使用相同的密钥
const JWT_SECRET = process.env.JWT_SECRET || "family-finance-secret-key";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, "jwt") implements OnModuleInit {
  private readonly logger = new Logger("JWT-STRATEGY", { timestamp: true });

  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: true, // 暂时忽略过期，便于测试
      secretOrKey: JWT_SECRET,
      passReqToCallback: false,
    });

    this.logger.log(`✅ JwtStrategy 构造函数执行完成!`);
    this.logger.log(`✅ 配置: secretKey='${JWT_SECRET.substring(0, 5)}...', ignoreExpiration=true`);
    this.logger.log(`✅ 名称: ${JwtStrategy.name}, 策略名称: 'jwt'`);
  }

  // 在模块初始化时执行
  onModuleInit() {
    this.logger.log("✅ 已准备好处理JWT认证请求!");
  }

  async validate(payload: any) {
    if (payload === null || payload === undefined) {
      this.logger.error("❌ JwtStrategy validate: payload为null或undefined!");
      return null;
    }

    try {
      const payloadStr = JSON.stringify(payload);
      this.logger.log(`✅ 🔐 JwtStrategy validate: payload内容=${payloadStr}`);
    } catch (e) {
      this.logger.error(`❌ JwtStrategy validate: 无法序列化payload: ${e.message}`);
    }

    // 返回 payload 中的信息
    return { userId: payload.sub, username: payload.username };
  }
}
