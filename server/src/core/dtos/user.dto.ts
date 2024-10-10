import { IsAlphanumeric, IsEmail, IsNotEmpty, IsString, MaxLength, MinLength, ValidateIf } from 'class-validator';

export class UserLoginReqDto {
  @IsEmail()
  @ValidateIf((o) => !o.username)
  email: string;

  @IsString()
  @IsAlphanumeric()
  @MaxLength(16)
  @MinLength(4)
  @ValidateIf((o) => !o.email)
  username: string;

  @IsString()
  @IsNotEmpty()
  password: string;

  @IsString()
  @IsNotEmpty()
  user_agent: string;

  @IsString()
  @IsNotEmpty()
  ip_address: string;
}

export class UserSessionVerifyReqDto {
  @IsString()
  @IsNotEmpty()
  session_id: string;

  @IsString()
  @IsNotEmpty()
  code: string;
}
