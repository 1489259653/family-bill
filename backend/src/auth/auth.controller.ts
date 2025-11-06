import { Body, Controller, HttpCode, HttpStatus, Post, UnauthorizedException } from "@nestjs/common";
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { AuthService } from "./auth.service";
import { LoginDto } from "./dto/login.dto";
import { RegisterDto } from "./dto/register.dto";

@ApiTags("认证管理")
@Controller("auth")
export class AuthController {
  constructor(private authService: AuthService) {}

  @ApiOperation({
    summary: "用户登录",
    description: "通过用户名或邮箱和密码登录，获取访问令牌",
  })
  @ApiBody({
    type: LoginDto,
    examples: {
      email: {
        value: {
          usernameOrEmail: "user@example.com",
          password: "123456",
        },
        summary: "使用邮箱登录",
      },
      username: {
        value: {
          usernameOrEmail: "张三",
          password: "123456",
        },
        summary: "使用用户名登录",
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: "登录成功",
    schema: {
      example: {
        success: true,
        message: "登录成功",
        access_token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
        user: {
          id: 1,
          username: "张三",
          email: "user@example.com",
        },
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: "用户名或邮箱或密码错误",
  })
  @Post("login")
  @HttpCode(HttpStatus.OK)
  async login(@Body() loginDto: LoginDto) {
    const user = await this.authService.validateUser(loginDto.usernameOrEmail, loginDto.password);
    if (!user) {
      throw new UnauthorizedException("用户名或邮箱或密码错误");
    }

    const loginResult = await this.authService.login(user);
    return {
      success: true,
      message: "登录成功",
      ...loginResult,
    };
  }

  @ApiOperation({
    summary: "用户注册",
    description: "创建新用户并自动登录",
  })
  @ApiBody({
    type: RegisterDto,
    examples: {
      default: {
        value: {
          username: "张三",
          email: "user@example.com",
          password: "123456",
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: "注册成功",
    schema: {
      example: {
        success: true,
        message: "注册成功",
        access_token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
        user: {
          id: 1,
          username: "张三",
          email: "user@example.com",
        },
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: "请求参数错误或邮箱已存在",
  })
  @Post("register")
  async register(@Body() registerDto: RegisterDto) {
    try {
      const user = await this.authService.register(registerDto);
      const loginResult = await this.authService.login(user);

      return {
        success: true,
        message: "注册成功",
        ...loginResult,
      };
    } catch (error) {
      throw error;
    }
  }
}
