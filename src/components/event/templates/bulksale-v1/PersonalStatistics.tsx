import { useWeb3React } from '@web3-react/core';
import { Skeleton } from 'antd';
import { CryptoCurrency, formatPrice } from '../../../../utils/prices';

type Props = {
  inputValue: number;
  myTotalDonations: number;
  totalProvidedToken: number;
  totalDonations: number;
  providedTokenSymbol: CryptoCurrency;
  donatedTokenSymbol: CryptoCurrency;
};

const PersonalStatistics = ({
  inputValue,
  myTotalDonations,
  totalProvidedToken,
  totalDonations,
  providedTokenSymbol,
  donatedTokenSymbol,
}: Props) => {
  const { active } = useWeb3React();
  // FIXME: replace mock
  const isLoading = false;

  function getExpectedTxjpAmount(
    myTotalDonations: number,
    inputtingValue: number
  ) {
    let donations = 0;
    if (!Number.isNaN(myTotalDonations)) {
      donations += myTotalDonations;
    }
    if (!Number.isNaN(inputtingValue)) {
      donations += inputtingValue;
    }

    return (donations / totalDonations) * totalProvidedToken;
  }

  return (
    <div style={{ marginTop: '40px', fontSize: '2em' }}>
      {!isLoading ? (
        <>
          <p>
            {providedTokenSymbol}獲得予定数:{' '}
            <span style={{ fontWeight: 'bold', marginLeft: '10px' }}>
              {active
                ? formatPrice(
                    getExpectedTxjpAmount(myTotalDonations, inputValue),
                    providedTokenSymbol
                  )
                : '????'}{' '}
              {providedTokenSymbol.toUpperCase()}
            </span>
          </p>
          <p>
            現寄付
            <span style={{ fontWeight: 'bold', marginLeft: '10px' }}>
              {active
                ? formatPrice(myTotalDonations, donatedTokenSymbol)
                : '????'}{' '}
              {donatedTokenSymbol.toUpperCase()}
            </span>{' '}
            + 新寄付
            <span style={{ fontWeight: 'bold', marginLeft: '10px' }}>
              {active ? formatPrice(inputValue, donatedTokenSymbol) : '????'}{' '}
              {donatedTokenSymbol.toUpperCase()}
            </span>
          </p>
        </>
      ) : (
        <Skeleton active />
      )}
    </div>
  );
};

export default PersonalStatistics;
