import { BigNumber } from 'bignumber.js';

type BigNumberValueType = BigNumber | number;

export function add(v1: BigNumberValueType, v2: BigNumberValueType): BigNumber {
  const a = getBigNumber(v1);
  const b = getBigNumber(v2);
  return a.plus(b);
}
export function addToNum(
  v1: BigNumberValueType,
  v2: BigNumberValueType
): number {
  return add(v1, v2).toNumber();
}

export function subtract(
  v1: BigNumberValueType,
  v2: BigNumberValueType
): BigNumber {
  const a = getBigNumber(v1);
  const b = getBigNumber(v2);
  return a.minus(b);
}
export function subtractToNum(
  v1: BigNumberValueType,
  v2: BigNumberValueType
): number {
  return subtract(v1, v2).toNumber();
}

export function multiply(
  v1: BigNumberValueType,
  v2: BigNumberValueType
): BigNumber {
  const a = getBigNumber(v1);
  const b = getBigNumber(v2);
  return a.multipliedBy(b);
}
export function multiplyToNum(
  v1: BigNumberValueType,
  v2: BigNumberValueType
): number {
  return multiply(v1, v2).toNumber();
}

export function divide(
  v1: BigNumberValueType,
  v2: BigNumberValueType
): BigNumber {
  const a = getBigNumber(v1);
  const b = getBigNumber(v2);
  return a.dividedBy(b);
}
export function divideToNum(
  v1: BigNumberValueType,
  v2: BigNumberValueType
): number {
  return divide(v1, v2).toNumber();
}

export function getBigNumber(val: BigNumberValueType): BigNumber {
  if (val instanceof BigNumber) {
    return val;
  }
  return new BigNumber(val);
}
