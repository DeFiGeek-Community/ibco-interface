import { formatPrice } from './prices';

describe('formatPrice', () => {
  it('works for eth', () => {
    const oneWei = 0.000000000000000001;
    expect(formatPrice(oneWei, 'eth').value).toBe('0.000000000');
    const interger = 1;
    expect(formatPrice(interger, 'eth').value).toBe('1');
    const floored = 0.0000000019;
    expect(formatPrice(floored, 'eth').value).toBe('0.000000001');
    const eliminatedUnnecessaryZero = 0.0001;
    expect(formatPrice(eliminatedUnnecessaryZero, 'eth').value).toBe('0.0001');
    expect(formatPrice(eliminatedUnnecessaryZero, 'eth').value).not.toBe(
      '0.000100000'
    );
    const comma = 12345.6789;
    expect(formatPrice(comma, 'eth').value).toBe('12,345.6789');

    const nonValue = null;
    expect(formatPrice(nonValue as any, 'eth').value).toBe('0');
    const reallyZero = 0;
    expect(formatPrice(reallyZero, 'eth').value).toBe('0');
  });

  it('works for txjp', () => {
    const minValue = 0.00000001;
    expect(formatPrice(minValue, 'txjp').value).toBe('0.00000001');
    const overflowed = 0.000000001;
    expect(formatPrice(overflowed, 'txjp').value).toBe('0.00000000');
    const floored = 0.000000019;
    expect(formatPrice(floored, 'txjp').value).toBe('0.00000001');
    const eliminatedUnnecessaryZero = 0.0001;
    expect(formatPrice(eliminatedUnnecessaryZero, 'txjp').value).toBe('0.0001');
    expect(formatPrice(eliminatedUnnecessaryZero, 'txjp').value).not.toBe(
      '0.00010000'
    );
    const comma = 12345.6789;
    expect(formatPrice(comma, 'txjp').value).toBe('12,345.6789');

    const nonValue = null;
    expect(formatPrice(nonValue as any, 'txjp').value).toBe('0');
    const reallyZero = 0;
    expect(formatPrice(reallyZero, 'txjp').value).toBe('0');
  });

  it('works for isZeroByRound', () => {
    const oneWei = 0.000000000000000001;
    expect(formatPrice(oneWei, 'eth').isZeroByRound).toBe(true);
    const interger = 1;
    expect(formatPrice(interger, 'eth').isZeroByRound).toBe(false);
    const fractional = 0.1;
    expect(formatPrice(fractional, 'eth').isZeroByRound).toBe(false);

    const nonValue = null;
    expect(formatPrice(nonValue as any, 'eth').isZeroByRound).toBe(false);
    const reallyZero = 0;
    expect(formatPrice(reallyZero, 'eth').isZeroByRound).toBe(false);
  });
});
