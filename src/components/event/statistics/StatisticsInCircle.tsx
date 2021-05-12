import { Skeleton } from 'antd';
import { Circle } from 'rc-progress';
import { useContext } from 'react';
import {
  CryptoCurrency,
  FiatCurrency,
  formatPrice,
} from '../../../utils/prices';
import { WalletContext } from '../../contexts';

type Props = {
  totalDonations: number;
  targetFigure: number;
  minTargetFigure: number;
  donatedTokenSymbol: CryptoCurrency;
  fiatSymbol: FiatCurrency;
  fiatRate: number;
};

export default function StatisticsInCircle({
  totalDonations,
  targetFigure,
  minTargetFigure,
  donatedTokenSymbol,
  fiatRate,
  fiatSymbol,
}: Props) {
  const { isConnected, isLoading } = useContext(WalletContext);

  const getTargetPercetage = () => {
    return (totalDonations / targetFigure) * 100;
  };

  const getFiatConversionAmount = (token: number) => {
    return token * fiatRate;
  };

  return (
    <div style={{ position: 'relative', minWidth: '500px' }}>
      <Circle
        percent={getTargetPercetage()}
        strokeWidth={4}
        strokeColor="#D3D3D3"
      />
      <span
        style={{
          display: 'inline-block',
          position: 'absolute',
          top: 150,
          left: 60,
          fontSize: '2rem',
          zIndex: 100,
        }}
      >
        <h3>Total Provided</h3>
        {!isLoading ? (
          <>
            <div>
              {isConnected
                ? formatPrice(totalDonations, donatedTokenSymbol)
                : '????'}{' '}
              {donatedTokenSymbol.toUpperCase()}
            </div>
            <div>
              ¥
              {isConnected
                ? formatPrice(
                    getFiatConversionAmount(totalDonations),
                    fiatSymbol
                  )
                : '????'}
            </div>
            {isConnected && !!minTargetFigure ? (
              <p
                style={{
                  textAlign: 'center',
                  fontSize: '1rem',
                }}
              >
                最小到達額 {minTargetFigure}
                {donatedTokenSymbol.toUpperCase()}{' '}
                {totalDonations >= minTargetFigure ? 'を達成しました🎉' : ''}
              </p>
            ) : null}
          </>
        ) : (
          <Skeleton active paragraph={{ rows: 2 }}></Skeleton>
        )}
      </span>
    </div>
  );
}
