import { IsEmail, IsNotEmpty, Matches, MinLength } from "class-validator";

export class RegisterDto {
  @IsNotEmpty({ message: "用户名不能为空" })
  @MinLength(3, { message: "用户名至少需要3个字符" })
  username: string;

  @IsEmail({}, { message: "请输入有效的邮箱地址" })
  @IsNotEmpty({ message: "邮箱不能为空" })
  email: string;

  @IsNotEmpty({ message: "密码不能为空" })
  @MinLength(6, { message: "密码至少需要6个字符" })
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, {
    message: "密码必须包含至少一个大写字母、一个小写字母和一个数字",
  })
  password: string;
}
