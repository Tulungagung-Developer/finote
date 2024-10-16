import Decimal from 'decimal.js';

export const DecimalNumber = Decimal.config({ precision: 10, rounding: 2 });
export type DecimalNumber = Decimal;
