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
  totalProvided: number;
  minimalProvideAmount: number;
  providedTokenSymbol: CryptoCurrency;
  fiatSymbol: FiatCurrency;
  fiatRate: number;
  contractAddress: string;
  isStarting: boolean;
};

export default function StatisticsInCircle({
  totalProvided,
  minimalProvideAmount,
  providedTokenSymbol,
  fiatSymbol,
  fiatRate,
  contractAddress,
  isStarting,
}: Props) {
  const { active } = useWeb3React();
  // FIXME: replace mock
  const isLoading = false;

  function getTargetPercetage() {
    return (totalProvided / minimalProvideAmount) * 100;
  }

  function getFiatConversionAmount(token: number) {
    return token * fiatRate;
  }

  return (
    <div style={{ position: 'relative', minWidth: '500px' }}>
      <ExternalLink href={`${ETHERSCAN_URL}address/${contractAddress}`}>
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
            left: 0,
            fontSize: '2rem',
            textAlign: 'center',
            width: '100%',
            zIndex: 100,
          }}
        >
          <h3
            style={{
              fontSize: '2rem',
            }}
          >
            Total Provided
          </h3>
          {!isLoading ? (
            <>
              <div
                style={{
                  fontSize: '3.5rem',
                  lineHeight: '3.5rem',
                }}
              >
                {isStarting && active
                  ? formatPrice(totalProvided, providedTokenSymbol)
                  : '????'}{' '}
                {providedTokenSymbol.toUpperCase()}
              </div>
              <span
                style={{
                  fontSize: '2rem',
                }}
              >
                ¥
                {isStarting && active
                  ? '' +
                    formatPrice(
                      getFiatConversionAmount(totalProvided),
                      fiatSymbol
                    )
                  : '????'}
              </span>
              {isStarting && active && !!minimalProvideAmount ? (
                <div
                  style={{
                    textAlign: 'center',
                    fontSize: '1rem',
                    marginTop: '10px',
                  }}
                >
                  最小到達額 {minimalProvideAmount}
                  {providedTokenSymbol.toUpperCase()}{' '}
                  {totalProvided >= minimalProvideAmount
                    ? 'を達成しました🎉'
                    : ''}
                </div>
              ) : null}
            </>
          ) : (
            <Skeleton active paragraph={{ rows: 2 }}></Skeleton>
          )}
        </span>
      </ExternalLink>
    </div>
  );
}
