import { Injectable, UnauthorizedException } from "@nestjs/common";
import type { JwtService } from "@nestjs/jwt";
import * as bcrypt from "bcryptjs";
import type { UsersService } from "../users/users.service";

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService
  ) {}

  async validateUser(usernameOrEmail: string, password: string): Promise<any> {
    // 判断输入是否为邮箱格式
    const isEmail = /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(usernameOrEmail);

    let user;
    if (isEmail) {
      user = await this.usersService.findByEmail(usernameOrEmail);
    } else {
      user = await this.usersService.findByUsername(usernameOrEmail);
    }

    if (user && (await bcrypt.compare(password, user.password))) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: any) {
    const payload = { username: user.username, sub: user.id };
    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
      },
    };
  }

  async register(registerDto: any) {
    const hashedPassword = await bcrypt.hash(registerDto.password, 10);

    const user = await this.usersService.create({
      ...registerDto,
      password: hashedPassword,
    });

    const { password, ...result } = user;
    return result;
  }
}
