import { useWeb3React } from '@web3-react/core';
import { Skeleton } from 'antd';
import { Circle } from 'rc-progress';
import styled from 'styled-components';
import { ETHERSCAN_URL } from '../../../constants/api';
import {
  CryptoCurrency,
  FiatCurrency,
  formatPrice,
} from '../../../utils/prices';
import { ExternalLink } from '../../ExternalLink';

const LeftCirclePosition = styled.div`
  position: relative;
  min-width: 500px;

  @media (max-width: 600px) {
    width: 100%;
    min-width: 0;
  }
`;

const InnerPosition = styled.span`
  display: inline-block;
  position: absolute;
  top: 150px;
  left: 0;
  font-size: 2rem;
  text-align: center;
  width: 100%;
  z-index: 100;

  @media (max-width: 600px) {
    top: 20%;
    left: 0;
  }
`;

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
    <LeftCirclePosition>
      <ExternalLink href={`${ETHERSCAN_URL}address/${contractAddress}`}>
        <Circle
          percent={getTargetPercetage()}
          strokeWidth={4}
          strokeColor="#D3D3D3"
        />
        <InnerPosition>
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
                  fontSize: '3rem',
                  lineHeight: '3.5rem',
                }}
              >
                {isStarting && active
                  ? formatPrice(totalProvided, providedTokenSymbol).value
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
                    ).value
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
                  目標 {minimalProvideAmount}
                  {providedTokenSymbol.toUpperCase()} {' 以上'}
                  {totalProvided >= minimalProvideAmount
                    ? 'を達成しました🎉'
                    : ''}
                </div>
              ) : null}
            </>
          ) : (
            <Skeleton active paragraph={{ rows: 2 }}></Skeleton>
          )}
        </InnerPosition>
      </ExternalLink>
    </LeftCirclePosition>
  );
}
