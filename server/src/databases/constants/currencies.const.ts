export enum Currencies {
  IDR = 'idr',
  USD = 'usd',
}

interface ICurrencies {
  locale: string;
  symbol: string;
}

const currencies = {
  [Currencies.IDR]: {
    locale: 'id-ID',
    symbol: 'Rp',
  },
  [Currencies.USD]: {
    locale: 'en-US',
    symbol: '$',
  },
};

export const getCurrency = (currency: Currencies): ICurrencies => {
  return currencies[currency];
};
