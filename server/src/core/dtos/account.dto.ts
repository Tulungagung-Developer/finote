import { Currencies } from '@db/constants/currencies.const';
import { AccountType } from '@db/entities/core/account.entity';
import { IsMoreThan } from '@libs/class-validator/more-than.decorator';
import { IsEnum, IsNotEmpty, IsNumber, IsString, IsUUID } from 'class-validator';

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
  reference: string;

  @IsNumber()
  @IsNotEmpty()
  minimum_balance: number;

  @IsNumber()
  @IsNotEmpty()
  @IsMoreThan('minimum_balance')
  initial_balance: number;
}

export class AccountUpdateReqDto {
  @IsUUID()
  @IsNotEmpty()
  account_id: string;

  @IsString()
  name: string;

  @IsString()
  reference: string;

  @IsNumber()
  minimum_balance: number;
}
