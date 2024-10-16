import { Currencies } from '@db/constants/currencies.const';
import { AccountType } from '@db/entities/core/account.entity';
import { IsMoreThan } from '@libs/class-validator/more-than.decorator';
import { IsDecimal, IsEnum, IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';

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

  @IsDecimal()
  @IsNotEmpty()
  minimum_balance: string;

  @IsDecimal()
  @IsNotEmpty()
  @IsMoreThan('minimum_balance')
  initial_balance: string;
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

  @IsDecimal()
  @IsOptional()
  minimum_balance: string;
}
