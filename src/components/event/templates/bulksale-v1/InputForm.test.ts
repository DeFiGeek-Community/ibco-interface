import {
  getInputValue,
  checkPrice,
  ErrorMessageForZero,
  ErrorMessageForDigits,
} from './InputForm';

describe('getInputValue', () => {
  it('works fine', () => {
    const interger = 1;
    expect(getInputValue(interger)).toBe(interger);
    const zero = 0;
    expect(getInputValue(zero)).toBe(zero);
    const float = 1.1;
    expect(getInputValue(float)).toBe(float);
    const exponent = 1e8;
    expect(getInputValue(exponent)).toBe(exponent);
  });

  it('works other than number', () => {
    const string1 = '10.1';
    expect(getInputValue(string1)).toBe(Number(string1));
    const string2 = 'あ';
    expect(getInputValue(string2)).toBe(0);
    const emptyString = '';
    expect(getInputValue(emptyString)).toBe(0);
    const boolean = true;
    expect(getInputValue(boolean)).toBe(1);
    const object = { value: 1 };
    expect(getInputValue(object)).toBe(0);
  });

  it('works with nullish value', () => {
    expect(getInputValue(undefined)).toBe(0);
    expect(getInputValue(null)).toBe(0);
  });
});

describe('checkPrice', () => {
  const dummyFirstArg = '';

  it('works fine', async () => {
    const interger = '1';
    expect(await checkPrice(dummyFirstArg, interger)).toBe(Number(interger));
    const float = '1.1';
    expect(await checkPrice(dummyFirstArg, float)).toBe(Number(float));
    const exponent = '1e8';
    expect(await checkPrice(dummyFirstArg, exponent)).toBe(Number(exponent));
    const fractionalDigitsIs18 = '0.000000000000000001';
    expect(await checkPrice(dummyFirstArg, fractionalDigitsIs18)).toBe(
      Number(fractionalDigitsIs18)
    );
    const intergerDigitsIsOver18 = '1234567890123456789';
    expect(await checkPrice(dummyFirstArg, intergerDigitsIsOver18)).toBe(
      Number(intergerDigitsIsOver18)
    );
  });

  it('shoud be error for Zero', () => {
    const zero = checkPrice(dummyFirstArg, '0');
    expect(zero).rejects.toThrow(ErrorMessageForZero);
    const char = checkPrice(dummyFirstArg, 'あ');
    expect(char).rejects.toThrow(ErrorMessageForZero);
    const nullish1 = checkPrice(dummyFirstArg, null as any);
    expect(nullish1).rejects.toThrow(ErrorMessageForZero);
    const nullish2 = checkPrice(dummyFirstArg, undefined as any);
    expect(nullish2).rejects.toThrow(ErrorMessageForZero);
  });

  it('shoud be error for over 18 digits', async () => {
    const exponent = checkPrice(dummyFirstArg, '1e-19');
    expect(exponent).rejects.toThrow(ErrorMessageForDigits);

    const overDigits1 = checkPrice(dummyFirstArg, '0.0000000000000000001');
    expect(overDigits1).rejects.toThrow(ErrorMessageForDigits);
    const overDigits2 = checkPrice(dummyFirstArg, '0.1000000000000000001');
    expect(overDigits2).rejects.toThrow(ErrorMessageForDigits);
    const overDigits3 = checkPrice(
      dummyFirstArg,
      '1234567890123456789.1234567890123456789'
    );
    expect(overDigits3).rejects.toThrow(ErrorMessageForDigits);
  });
});
