import { IsNotEmpty, IsOptional, MinLength } from 'class-validator';

export class CreateFamilyDto {
  @IsNotEmpty({ message: '家庭名称不能为空' })
  @MinLength(2, { message: '家庭名称至少需要2个字符' })
  name: string;
  
  @IsOptional()
  description?: string;
}