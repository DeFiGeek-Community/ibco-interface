import { Skeleton } from 'antd';
import { useContext } from 'react';
import { CryptoCurrency, formatPrice } from '../../../../utils/prices';
import { WalletContext } from '../../../contexts';

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
  const { isConnected, isLoading } = useContext(WalletContext);

  const getExpectedTxjpAmount = (
    myTotalDonations: number,
    inputtingValue: number
  ) => {
    let donations = 0;
    if (!Number.isNaN(myTotalDonations)) {
      donations += myTotalDonations;
    }
    if (!Number.isNaN(inputtingValue)) {
      donations += inputtingValue;
    }

    return (donations / totalDonations) * totalProvidedToken;
  };

  return (
    <div style={{ marginTop: '40px', fontSize: '2em' }}>
      {!isLoading ? (
        <>
          <p>
            {providedTokenSymbol}獲得予定数:{' '}
            <span style={{ fontWeight: 'bold', marginLeft: '10px' }}>
              {isConnected
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
              {isConnected
                ? formatPrice(myTotalDonations, donatedTokenSymbol)
                : '????'}{' '}
              {donatedTokenSymbol.toUpperCase()}
            </span>{' '}
            + 新寄付
            <span style={{ fontWeight: 'bold', marginLeft: '10px' }}>
              {isConnected
                ? formatPrice(inputValue, donatedTokenSymbol)
                : '????'}{' '}
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
