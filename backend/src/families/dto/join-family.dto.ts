import { IsNotEmpty } from 'class-validator';

export class JoinFamilyDto {
  @IsNotEmpty({ message: '邀请码不能为空' })
  invitationCode: string;
}