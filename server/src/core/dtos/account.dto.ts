import { Currencies } from '@db/constants/currencies.const';
import { AccountType } from '@db/entities/core/account.entity';
import { IsMoreThan } from '@libs/class-validator/more-than.decorator';
import { IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, IsUUID, Min } from 'class-validator';

export class AccountCreateReqDto {
  @IsEnum(AccountType)
  @IsNotEmpty()
  type: AccountType;

  @IsEnum(Currencies)
  @IsNotEmpty()
  currency: Currencies;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsOptional()
  reference: string;

  @IsNumber()
  @Min(0)
  @IsNotEmpty()
  minimum_balance: number;

  @IsNumber()
  @Min(0)
  @IsNotEmpty()
  @IsMoreThan('minimum_balance')
  initial_balance: number;
}

export class AccountUpdateReqDto {
  @IsUUID()
  @IsNotEmpty()
  account_id: string;

  @IsString()
  @IsOptional()
  name: string;

  @IsString()
  @IsOptional()
  reference: string;

  @IsNumber()
  @Min(0)
  @IsOptional()
  minimum_balance: number;
}
