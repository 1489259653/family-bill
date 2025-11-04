import { Controller, Post, Body, HttpCode, HttpStatus, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';

@ApiTags('认证管理')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @ApiOperation({
    summary: '用户登录',
    description: '通过邮箱和密码登录，获取访问令牌',
  })
  @ApiBody({
    type: LoginDto,
    examples: {
      default: {
        value: {
          email: 'user@example.com',
          password: '123456',
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: '登录成功',
    schema: {
      example: {
        success: true,
        message: '登录成功',
        access_token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
        user: {
          id: 1,
          username: '张三',
          email: 'user@example.com',
        },
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: '邮箱或密码错误',
  })
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() loginDto: LoginDto) {
    const user = await this.authService.validateUser(loginDto.email, loginDto.password);
    if (!user) {
      throw new UnauthorizedException('邮箱或密码错误');
    }
    
    const loginResult = await this.authService.login(user);
    return {
      success: true,
      message: '登录成功',
      ...loginResult,
    };
  }

  @ApiOperation({
    summary: '用户注册',
    description: '创建新用户并自动登录',
  })
  @ApiBody({
    type: RegisterDto,
    examples: {
      default: {
        value: {
          username: '张三',
          email: 'user@example.com',
          password: '123456',
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: '注册成功',
    schema: {
      example: {
        success: true,
        message: '注册成功',
        access_token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
        user: {
          id: 1,
          username: '张三',
          email: 'user@example.com',
        },
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: '请求参数错误或邮箱已存在',
  })
  @Post('register')
  async register(@Body() registerDto: RegisterDto) {
    try {
      const user = await this.authService.register(registerDto);
      const loginResult = await this.authService.login(user);
      
      return {
        success: true,
        message: '注册成功',
        ...loginResult,
      };
    } catch (error) {
      throw error;
    }
  }
}