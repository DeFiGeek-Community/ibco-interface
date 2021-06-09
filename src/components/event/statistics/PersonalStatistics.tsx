import { useWeb3React } from '@web3-react/core';
import { Skeleton } from 'antd';
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

    return (donations / totalDonations) * totalDistributeAmount;
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
                  )
                : '????'}{' '}
              {distributedTokenSymbol.toUpperCase()}
            </span>
          </p>
          {!isEnding ? (
            <p>
              現寄付
              <span style={{ fontWeight: 'bold', marginLeft: '10px' }}>
                {active
                  ? formatPrice(myTotalProvided, providedTokenSymbol)
                  : '????'}{' '}
                {providedTokenSymbol.toUpperCase()}
              </span>{' '}
              + 新寄付
              <span style={{ fontWeight: 'bold', marginLeft: '10px' }}>
                {active ? formatPrice(inputValue, providedTokenSymbol) : '????'}{' '}
                {providedTokenSymbol.toUpperCase()}
              </span>
            </p>
          ) : (
            <p>
              寄付
              <span style={{ fontWeight: 'bold', marginLeft: '10px' }}>
                {active
                  ? formatPrice(myTotalProvided, providedTokenSymbol)
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
