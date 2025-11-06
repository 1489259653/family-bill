import { Type } from "class-transformer";
import { IsBoolean, IsDate, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class CreateTransactionDto {
  @IsNotEmpty()
  @IsNumber({ maxDecimalPlaces: 2 })
  amount: number;

  @IsNotEmpty()
  @IsEnum(["income", "expense"])
  type: "income" | "expense";

  @IsNotEmpty()
  @IsString()
  category: string;

  @IsNotEmpty()
  @IsDate()
  @Type(() => Date)
  date: Date;

  @IsString()
  description?: string;

  @IsOptional()
  @IsBoolean()
  isFamilyBill: boolean;

  @IsOptional()
  payerId?: number;
}
