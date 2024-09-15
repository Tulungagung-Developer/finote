import { IsNotEmpty, IsString } from 'class-validator';

export class UserLoginReqDto {
  @IsString()
  @IsNotEmpty()
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
