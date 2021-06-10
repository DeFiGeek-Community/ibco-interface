import { COINGECKO_URL } from '../constants/api';

export type CryptoCurrency = 'eth' | 'txjp';
export type FiatCurrency = 'jpy';
export type CurrencyName = CryptoCurrency | FiatCurrency;

export function formatPrice(
  value: number,
  currency?: CurrencyName
): { value: string; isZeroByRound: boolean } {
  if (!value) {
    return { value: '0', isZeroByRound: false };
  }

  let decimalDigits = 18;
  if (currency) {
    // eth and erc20 may all be 9 digits.
    if (currency === 'eth') {
      decimalDigits = 9;
    } else if (currency === 'txjp') {
      decimalDigits = 8;
    } else if (currency === 'jpy') {
      decimalDigits = 0;
    }
  }

  const formattedValue = value.toFixed(decimalDigits);
  return {
    value: formattedValue,
    isZeroByRound: isZeroByRound(formattedValue),
  };
}

function isZeroByRound(value: string): boolean {
  const numbers = value.split('.');
  if (!numbers[1]) {
    return false;
  }

  return Number(numbers[1]) === 0;
}

export function getFialSymbol(currency: FiatCurrency) {
  if (currency === 'jpy') {
    return '¥';
  }
  return '';
}

/**
 * CoinGecko
 * https://www.coingecko.com/api/documentations/v3#/coins/get_coins_list
 */

export function getOracleUrlForFiatPriceOfToken(
  tokenName: string,
  fiatSymbol: FiatCurrency
) {
  return `${COINGECKO_URL}?ids=${tokenName}&vs_currencies=${fiatSymbol}`;
}

export function getTokenName(currency: CryptoCurrency) {
  if (currency === 'eth') {
    return 'ethereum';
  }
  return '';
}
