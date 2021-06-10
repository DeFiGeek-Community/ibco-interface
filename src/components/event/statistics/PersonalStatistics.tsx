import { useWeb3React } from '@web3-react/core';
import { Skeleton } from 'antd';
import { divide, multiplyToNum } from '../../../utils/bignumber';
import { CryptoCurrency, formatPrice } from '../../../utils/prices';

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

  function getExpectedTxjpAmount(
    myTotalDonations: number,
    inputtingValue: number
  ) {
    if (myTotalDonations + inputtingValue <= 0) {
      return 0;
    }
    if (Number.isNaN(myTotalDonations)) {
      myTotalDonations = 0;
    }
    if (Number.isNaN(inputtingValue)) {
      inputtingValue = 0;
    }

    const donations = myTotalDonations + inputtingValue;
    const totalDonations = totalProvided + inputtingValue;

    const amount = multiplyToNum(
      divide(donations, totalDonations),
      totalDistributeAmount
    );
    return amount;
  }

  return (
    <div style={{ marginTop: '40px', fontSize: '2em' }}>
      {!isLoading ? (
        <>
          <p>
            獲得予定数:{' '}
            <span style={{ fontWeight: 'bold', marginLeft: '10px' }}>
              {active
                ? formatPrice(
                    getExpectedTxjpAmount(myTotalProvided, inputValue),
                    distributedTokenSymbol
                  ).value
                : '????'}{' '}
              {distributedTokenSymbol.toUpperCase()}
            </span>
            {formatPrice(
              getExpectedTxjpAmount(myTotalProvided, inputValue),
              distributedTokenSymbol
            ).isZeroByRound && (
              <div
                style={{ fontSize: '1rem', color: 'gray', marginLeft: '10px' }}
              >
                少なすぎて0になっています
              </div>
            )}
          </p>
          {!isEnding ? (
            <p>
              現寄付
              <span style={{ fontWeight: 'bold', marginLeft: '10px' }}>
                {active
                  ? formatPrice(myTotalProvided, providedTokenSymbol).value
                  : '????'}{' '}
                {providedTokenSymbol.toUpperCase()}
              </span>{' '}
              + 新寄付
              <span style={{ fontWeight: 'bold', marginLeft: '10px' }}>
                {active
                  ? formatPrice(inputValue, providedTokenSymbol).value
                  : '????'}{' '}
                {providedTokenSymbol.toUpperCase()}
              </span>
            </p>
          ) : (
            <p>
              寄付
              <span style={{ fontWeight: 'bold', marginLeft: '10px' }}>
                {active
                  ? formatPrice(myTotalProvided, providedTokenSymbol).value
                  : '????'}{' '}
                {providedTokenSymbol.toUpperCase()}
              </span>
            </p>
          )}
        </>
      ) : (
        <Skeleton active />
      )}
    </div>
  );
};

export default PersonalStatistics;
