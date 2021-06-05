import { useWeb3React } from '@web3-react/core';
import { Skeleton } from 'antd';
import { Circle } from 'rc-progress';
import { ETHERSCAN_URL } from '../../../constants/api';
import {
  CryptoCurrency,
  FiatCurrency,
  formatPrice,
} from '../../../utils/prices';
import { ExternalLink } from '../../ExternalLink';

type Props = {
  totalDonations: number;
  targetFigure: number;
  minTargetFigure: number;
  donatedTokenSymbol: CryptoCurrency;
  fiatSymbol: FiatCurrency;
  fiatRate: number;
  contractAddress: string;
};

export default function StatisticsInCircle({
  totalDonations,
  targetFigure,
  minTargetFigure,
  donatedTokenSymbol,
  fiatRate,
  fiatSymbol,
  contractAddress,
}: Props) {
  const { active } = useWeb3React();
  // FIXME: replace mock
  const isLoading = false;

  function getTargetPercetage() {
    return (totalDonations / targetFigure) * 100;
  }

  function getFiatConversionAmount(token: number) {
    return token * fiatRate;
  }

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
              {active ? (
                <ExternalLink
                  href={`${ETHERSCAN_URL}address/${contractAddress}`}
                >
                  {formatPrice(totalDonations, donatedTokenSymbol)}
                </ExternalLink>
              ) : (
                '????'
              )}{' '}
              {donatedTokenSymbol.toUpperCase()}
            </div>
            <div>
              ¥
              {active
                ? formatPrice(
                    getFiatConversionAmount(totalDonations),
                    fiatSymbol
                  )
                : '????'}
            </div>
            {active && !!minTargetFigure ? (
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
