import { useWeb3React } from '@web3-react/core';
import { Skeleton } from 'antd';
import styled from 'styled-components';
import { divide, multiplyToNum } from '../../../utils/bignumber';
import { CryptoCurrency, formatPrice } from '../../../utils/prices';

const Wrapper = styled.div`
  margin-top: 40px;
  font-size: 2rem;

  @media (max-width: 600px) {
    font-size: 1.2rem;
  }
`;

type Props = {
  inputValue: number;
  myTotalProvided: number;
  totalProvided: number;
  totalDistributeAmount: number;
  distributedTokenSymbol: CryptoCurrency;
  providedTokenSymbol: CryptoCurrency;
  isEnding: boolean;
};

const PersonalStatistics = ({
  inputValue,
  myTotalProvided,
  totalProvided,
  totalDistributeAmount,
  distributedTokenSymbol,
  providedTokenSymbol,
  isEnding,
}: Props) => {
  const { active } = useWeb3React();
  // FIXME: replace mock
  const isLoading = false;

  const expectedAmount = formatPrice(
    getExpectedTxjpAmount(myTotalProvided, inputValue),
    distributedTokenSymbol
  );
  const sumOfProvidedAmount = formatPrice(
    myTotalProvided + inputValue,
    providedTokenSymbol
  );
  const fixedProvidedAmount = formatPrice(myTotalProvided, providedTokenSymbol);
  const inputtingProvidedAmount = formatPrice(inputValue, providedTokenSymbol);

  function getExpectedTxjpAmount(
    myTotalDonations: number,
    inputtingValue: number
  ) {
    if (Number.isNaN(myTotalDonations)) {
      myTotalDonations = 0;
    }
    if (Number.isNaN(inputtingValue)) {
      inputtingValue = 0;
    }
    if (Number.isNaN(totalProvided)) {
      totalProvided = 0;
    }

    const donations = myTotalDonations + inputtingValue;
    const totalDonations = totalProvided + inputtingValue;
    if (totalDonations <= 0) {
      return 0;
    }

    const amount = multiplyToNum(
      divide(donations, totalDonations),
      totalDistributeAmount
    );
    return amount;
  }

  return (
    <Wrapper>
      {!isLoading ? (
        <>
          <p>
            獲得予定数:{' '}
            <span style={{ fontWeight: 'bold', marginLeft: '10px' }}>
              {active ? expectedAmount.value : '????'}{' '}
              {distributedTokenSymbol.toUpperCase()}
            </span>
            {expectedAmount.isZeroByRound && (
              <div
                style={{ fontSize: '1rem', color: 'gray', marginLeft: '10px' }}
              >
                少なすぎて0になっています
              </div>
            )}
          </p>
          {!isEnding ? (
            <p>
              寄付合計:
              <span style={{ fontWeight: 'bold', marginLeft: '10px' }}>
                {active ? sumOfProvidedAmount.value : '????'}{' '}
                {providedTokenSymbol.toUpperCase()}
              </span>{' '}
              {active && (
                <>
                  (入力中
                  <span style={{ fontWeight: 'bold', marginLeft: '10px' }}>
                    {inputtingProvidedAmount.value}{' '}
                    {providedTokenSymbol.toUpperCase()}
                  </span>
                  )
                </>
              )}
              {sumOfProvidedAmount.isZeroByRound && (
                <div
                  style={{
                    fontSize: '1rem',
                    color: 'gray',
                    marginLeft: '10px',
                  }}
                >
                  少なすぎて0になっています
                </div>
              )}
            </p>
          ) : (
            <p>
              寄付
              <span style={{ fontWeight: 'bold', marginLeft: '10px' }}>
                {active ? fixedProvidedAmount.value : '????'}{' '}
                {providedTokenSymbol.toUpperCase()}
              </span>
              {fixedProvidedAmount.isZeroByRound && (
                <div
                  style={{
                    fontSize: '1rem',
                    color: 'gray',
                    marginLeft: '10px',
                  }}
                >
                  少なすぎて0になっています
                </div>
              )}
            </p>
          )}
        </>
      ) : (
        <Skeleton active />
      )}
    </Wrapper>
  );
};

export default PersonalStatistics;
