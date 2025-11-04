import { Controller, Post, Body, Get, UseGuards, Request, Patch } from '@nestjs/common';
import { FamiliesService } from './families.service';
import { CreateFamilyDto } from './dto/create-family.dto';
import { JoinFamilyDto } from './dto/join-family.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('families')
@UseGuards(JwtAuthGuard)
export class FamiliesController {
  constructor(private readonly familiesService: FamiliesService) {}

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

  // 获取当前用户的家庭信息
  @Get('/current')
  async getCurrentFamily(@Request() req) {
    const family = await this.familiesService.getUserFamily(req.user.userId);
    return {
      success: true,
      data: family,
    };
  }

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

  // 退出家庭
  @Post('/leave')
  async leaveFamily(@Request() req) {
    await this.familiesService.leaveFamily(req.user.userId);
    return {
      success: true,
      message: '成功退出家庭',
    };
  }

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