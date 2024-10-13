import Decimal from 'decimal.js';
import { Decimal as Lib } from 'decimal.js';

export const DecimalNumber = Lib.config({ precision: 10, rounding: 2 });
export type DecimalNumber = Decimal | Lib;
