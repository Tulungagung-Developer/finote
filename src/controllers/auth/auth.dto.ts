import { IsNotEmpty, IsString } from 'class-validator';

export class AuthLoginBodyDto {
  @IsNotEmpty()
  @IsString()
  username: string;

  @IsNotEmpty()
  @IsString()
  password: string;
}

export class AuthLoginResDto {
  access_token: string;
}
