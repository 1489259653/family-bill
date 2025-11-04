import { Controller, Post, Body, Get, UseGuards, Request, Patch } from '@nestjs/common';
import { FamiliesService } from './families.service';
import { CreateFamilyDto } from './dto/create-family.dto';
import { JoinFamilyDto } from './dto/join-family.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ApiTags, ApiOperation, ApiResponse, ApiBody, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('家庭管理')
@ApiBearerAuth('access_token')
@Controller('families')
@UseGuards(JwtAuthGuard)
export class FamiliesController {
  constructor(private readonly familiesService: FamiliesService) {}

  @ApiOperation({
    summary: '创建新家庭',
    description: '创建一个新的家庭群组',
  })
  @ApiBody({
    type: CreateFamilyDto,
    examples: {
      default: {
        value: {
          name: '我的家庭',
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: '家庭创建成功',
    schema: {
      example: {
        success: true,
        message: '家庭创建成功',
        data: {
          id: 1,
          name: '我的家庭',
          createdAt: '2025-11-04T12:00:00Z',
        },
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: '请求参数错误',
  })
  // 创建新家庭
  @Post()
  async createFamily(@Body() createFamilyDto: CreateFamilyDto, @Request() req) {
    const family = await this.familiesService.createFamily(createFamilyDto, req.user.userId);
    return {
      success: true,
      message: '家庭创建成功',
      data: family,
    };
  }

  @ApiOperation({
    summary: '通过邀请码加入家庭',
    description: '使用邀请码加入已有的家庭群组',
  })
  @ApiBody({
    type: JoinFamilyDto,
    examples: {
      default: {
        value: {
          invitationCode: 'ABC123',
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: '成功加入家庭',
    schema: {
      example: {
        success: true,
        message: '成功加入家庭',
        data: {
          id: 1,
          name: '我的家庭',
          createdAt: '2025-11-04T12:00:00Z',
        },
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: '邀请码无效或已过期',
  })
  // 通过邀请码加入家庭
  @Post('/join')
  async joinFamily(@Body() joinFamilyDto: JoinFamilyDto, @Request() req) {
    const family = await this.familiesService.joinFamily(joinFamilyDto, req.user.userId);
    return {
      success: true,
      message: '成功加入家庭',
      data: family,
    };
  }

  @ApiOperation({
    summary: '获取当前用户的家庭信息',
    description: '获取当前登录用户所在的家庭信息',
  })
  @ApiResponse({
    status: 200,
    description: '获取成功',
    schema: {
      example: {
        success: true,
        data: {
          id: 1,
          name: '我的家庭',
          createdAt: '2025-11-04T12:00:00Z',
        },
      },
    },
  })
  // 获取当前用户的家庭信息
  @Get('/current')
  async getCurrentFamily(@Request() req) {
    const family = await this.familiesService.getUserFamily(req.user.userId);
    return {
      success: true,
      data: family,
    };
  }

  @ApiOperation({
    summary: '获取家庭所有成员',
    description: '获取当前家庭的所有成员信息',
  })
  @ApiResponse({
    status: 200,
    description: '获取成功',
    schema: {
      example: {
        success: true,
        data: [
          {
            id: 1,
            username: '张三',
            email: 'zhangsan@example.com',
            role: 'owner',
          },
          {
            id: 2,
            username: '李四',
            email: 'lisi@example.com',
            role: 'member',
          },
        ],
      },
    },
  })
  // 获取家庭所有成员
  @Get('/members')
  async getFamilyMembers(@Request() req) {
    const family = await this.familiesService.getUserFamily(req.user.userId);
    
    if (!family) {
      return {
        success: true,
        message: '您还没有加入任何家庭',
        data: [],
      };
    }

    const members = await this.familiesService.getFamilyMembers(family.id, req.user.userId);
    return {
      success: true,
      data: members,
    };
  }

  @ApiOperation({
    summary: '退出家庭',
    description: '当前用户退出所在的家庭',
  })
  @ApiResponse({
    status: 200,
    description: '成功退出家庭',
    schema: {
      example: {
        success: true,
        message: '成功退出家庭',
      },
    },
  })
  // 退出家庭
  @Post('/leave')
  async leaveFamily(@Request() req) {
    await this.familiesService.leaveFamily(req.user.userId);
    return {
      success: true,
      message: '成功退出家庭',
    };
  }

  @ApiOperation({
    summary: '获取家庭邀请码',
    description: '获取或刷新家庭的邀请码（仅家庭所有者可用）',
  })
  @ApiResponse({
    status: 200,
    description: '获取成功',
    schema: {
      example: {
        success: true,
        data: {
          invitationCode: 'ABC123',
        },
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: '您还没有加入任何家庭或没有权限',
  })
  // 获取家庭邀请码
  @Get('/invitation-code')
  async getInvitationCode(@Request() req) {
    const family = await this.familiesService.getUserFamily(req.user.userId);
    
    if (!family) {
      return {
        success: false,
        message: '您还没有加入任何家庭',
      };
    }

    const invitationCode = await this.familiesService.getOrRefreshInvitationCode(family.id, req.user.userId);
    return {
      success: true,
      data: {
        invitationCode,
      },
    };
  }
}