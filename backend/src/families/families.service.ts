import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Family } from './entities/family.entity';
import { FamilyMember, FamilyRole } from './entities/family-member.entity';
import { CreateFamilyDto } from './dto/create-family.dto';
import { JoinFamilyDto } from './dto/join-family.dto';
import { User } from '../users/entities/user.entity';
import * as crypto from 'crypto';

@Injectable()
export class FamiliesService {
  constructor(
    @InjectRepository(Family) private familyRepository: Repository<Family>,
    @InjectRepository(FamilyMember) private familyMemberRepository: Repository<FamilyMember>,
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  // 生成唯一的邀请码
  private generateInvitationCode(): string {
    return crypto.randomBytes(6).toString('hex').toUpperCase();
  }

  // 创建新家庭
  async createFamily(createFamilyDto: CreateFamilyDto, userId: number): Promise<Family> {
    // 检查用户是否已经在某个家庭中
    const existingMembership = await this.familyMemberRepository.findOne({
      where: { user: { id: userId }, isActive: true },
    });

    if (existingMembership) {
      throw new ConflictException('您已经加入了一个家庭');
    }

    // 创建新家庭
    const family = this.familyRepository.create({
      ...createFamilyDto,
      invitationCode: this.generateInvitationCode(),
    });

    const savedFamily = await this.familyRepository.save(family);

    // 将创建者添加为管理员
    const familyMember = this.familyMemberRepository.create({
      family: savedFamily,
      user: { id: userId },
      role: FamilyRole.ADMIN,
    });

    await this.familyMemberRepository.save(familyMember);

    return savedFamily;
  }

  // 通过邀请码加入家庭
  async joinFamily(joinFamilyDto: JoinFamilyDto, userId: number): Promise<Family> {
    const { invitationCode } = joinFamilyDto;

    // 查找家庭
    const family = await this.familyRepository.findOne({
      where: { invitationCode },
    });

    if (!family) {
      throw new NotFoundException('邀请码无效或家庭不存在');
    }

    // 检查用户是否已经在这个家庭中
    const existingMembership = await this.familyMemberRepository.findOne({
      where: { family: { id: family.id }, user: { id: userId } },
    });

    if (existingMembership) {
      if (existingMembership.isActive) {
        throw new ConflictException('您已经是这个家庭的成员');
      } else {
        // 如果之前退出了家庭，重新激活
        existingMembership.isActive = true;
        await this.familyMemberRepository.save(existingMembership);
        return family;
      }
    }

    // 检查用户是否已经在其他家庭中
    const otherMembership = await this.familyMemberRepository.findOne({
      where: { user: { id: userId }, isActive: true },
    });

    if (otherMembership) {
      throw new ConflictException('您已经加入了一个家庭，请先退出当前家庭');
    }

    // 创建新的家庭成员关系
    const familyMember = this.familyMemberRepository.create({
      family,
      user: { id: userId },
      role: FamilyRole.MEMBER,
    });

    await this.familyMemberRepository.save(familyMember);

    return family;
  }

  // 获取用户的家庭信息
  async getUserFamily(userId: number): Promise<Family | null> {
    const familyMember = await this.familyMemberRepository.findOne({
      where: { user: { id: userId }, isActive: true },
      relations: ['family'],
    });

    return familyMember?.family || null;
  }

  // 获取家庭中的所有成员
  async getFamilyMembers(familyId: number, userId: number): Promise<any[]> {
    // 验证当前用户是否是家庭的成员
    const currentMember = await this.familyMemberRepository.findOne({
      where: { user: { id: userId }, family: { id: familyId }, isActive: true },
    });

    if (!currentMember) {
      throw new NotFoundException('您不是这个家庭的成员');
    }

    const members = await this.familyMemberRepository.find({
      where: { family: { id: familyId }, isActive: true },
      relations: ['user'],
    });

    // 返回包含用户信息和家庭角色信息的对象
    return members.map(member => ({
      ...member.user,
      isAdmin: member.role ==FamilyRole.ADMIN,
      familyMemberId: member.id
    }));
  }

  // 退出家庭
  async leaveFamily(userId: number): Promise<void> {
    const familyMember = await this.familyMemberRepository.findOne({
      where: { user: { id: userId }, isActive: true },
      relations: ['family', 'family.members'],
    });

    if (!familyMember) {
      throw new NotFoundException('您还没有加入任何家庭');
    }

    // 检查是否是唯一的管理员
    const adminMembers = await this.familyMemberRepository.count({
      where: { 
        family: { id: familyMember.family.id }, 
        role: FamilyRole.ADMIN, 
        isActive: true 
      },
    });

    if (familyMember.role === FamilyRole.ADMIN && adminMembers === 1) {
      throw new ConflictException('您是家庭的唯一管理员，无法退出家庭。请先转让管理员权限或删除家庭。');
    }

    // 将成员状态设置为非活跃
    familyMember.isActive = false;
    await this.familyMemberRepository.save(familyMember);
  }

  // 获取或生成新的邀请码
  async getOrRefreshInvitationCode(familyId: number, userId: number): Promise<string> {
    // 验证当前用户是否是家庭的管理员
    const currentMember = await this.familyMemberRepository.findOne({
      where: { 
        user: { id: userId }, 
        family: { id: familyId }, 
        isActive: true,
        role: FamilyRole.ADMIN
      },
      relations: ['family'],
    });

    if (!currentMember) {
      throw new NotFoundException('只有家庭管理员可以查看邀请码');
    }

    return currentMember.family.invitationCode;
  }

  // 删除家庭
  async deleteFamily(userId: number): Promise<void> {
    // 获取用户所在的家庭信息
    const familyMember = await this.familyMemberRepository.findOne({
      where: { user: { id: userId }, isActive: true },
      relations: ['family'],
    });

    if (!familyMember) {
      throw new NotFoundException('您还没有加入任何家庭');
    }

    // 检查用户是否是家庭管理员
    if (familyMember.role !== FamilyRole.ADMIN) {
      throw new ConflictException('只有家庭管理员可以删除家庭');
    }

    const familyId = familyMember.family.id;

    // 先删除所有家庭成员关联记录，避免外键约束错误
    await this.familyMemberRepository.delete({
      family: { id: familyId }
    });

    // 删除家庭
    await this.familyRepository.delete(familyId);
  }
}