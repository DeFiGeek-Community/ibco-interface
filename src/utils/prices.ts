import { multiplyToNum } from './bignumber';

export type CryptoCurrency = 'eth' | 'txjp';
export type FiatCurrency = 'jpy';
export type CurrencyName = CryptoCurrency | FiatCurrency;

export function formatPrice(value: number, currency?: CurrencyName) {
  let decimalDigits = 18;
  if (currency) {
    // eth、erc20系は全て9桁でまとめても良い
    if (currency === 'eth') {
      decimalDigits = 9;
    } else if (currency === 'txjp') {
      decimalDigits = 9;
    } else if (currency === 'jpy') {
      decimalDigits = 0;
    }
  }
  // 小数点以下は、decimalDigitsの桁数で切り捨てる
  const base = 10 ** decimalDigits;
  const flooredValue = Math.floor(multiplyToNum(value, base)) / base;
  return flooredValue.toLocaleString(undefined, {
    maximumFractionDigits: decimalDigits,
  });
}

export function getFialSymbol(currency: FiatCurrency) {
  if (currency === 'jpy') {
    return '¥';
  }
  return '';
}

// coin geckoのレスポンス
// https://www.coingecko.com/api/documentations/v3#/coins/get_coins_list
export function getTokenName(currency: CryptoCurrency) {
  if (currency === 'eth') {
    return 'ethereum';
  }
  return '';
}
