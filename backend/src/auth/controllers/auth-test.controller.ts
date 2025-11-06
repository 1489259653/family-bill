import { Controller, Get, HttpException, HttpStatus, Req } from "@nestjs/common";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";

@ApiTags("认证测试")
@Controller("auth-test")
export class AuthTestController {
  @Get("check-header")
  @ApiOperation({ summary: "检查 Authorization 头是否被正确读取" })
  @ApiResponse({ status: 200, description: "返回 Authorization 头信息" })
  @ApiResponse({ status: 400, description: "未找到 Authorization 头" })
  checkAuthHeader(@Req() request) {
    const authHeader = request.headers.authorization;

    if (!authHeader) {
      throw new HttpException("未找到 Authorization 头", HttpStatus.BAD_REQUEST);
    }

    return {
      message: "Authorization 头已被成功读取",
      headerValue: authHeader,
      headers: Object.keys(request.headers),
    };
  }
}
