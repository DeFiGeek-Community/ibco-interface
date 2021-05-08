import { Circle } from 'rc-progress';
import {
  CryptoCurrency,
  FiatCurrency,
  formatPrice,
} from '../../../utils/prices';

type Props = {
  totalDonations: number;
  targetFigure: number;
  donatedTokenSymbol: CryptoCurrency;
  fiatSymbol: FiatCurrency;
  fiatRate: number;
};

export default function StatisticsInCircle({
  totalDonations,
  targetFigure,
  donatedTokenSymbol,
  fiatRate,
  fiatSymbol,
}: Props) {
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
          fontSize: '2em',
          zIndex: 100,
        }}
      >
        <h3>Total Provided</h3>
        <p>
          {formatPrice(totalDonations, donatedTokenSymbol)}{' '}
          {donatedTokenSymbol.toUpperCase()}
        </p>
        <p>
          ¥{formatPrice(getFiatConversionAmount(totalDonations), fiatSymbol)}
        </p>
      </span>
    </div>
  );
}
