export enum Currencies {
  IDR = 'idr',
  USD = 'usd',
}

interface ICurrencies {
  locale: string;
  symbol: string;
}

export const currencies = new Map<Currencies, ICurrencies>()
  .set(Currencies.IDR, { locale: 'id-ID', symbol: 'Rp' })
  .set(Currencies.USD, { locale: 'en-US', symbol: '$' });
