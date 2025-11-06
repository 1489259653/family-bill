import { IsNotEmpty } from "class-validator";

export class LoginDto {
  @IsNotEmpty({ message: "用户名或邮箱不能为空" })
  usernameOrEmail: string;

  @IsNotEmpty({ message: "密码不能为空" })
  password: string;
}
