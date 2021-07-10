import { StarTwoTone } from '@ant-design/icons';
import { Circle } from 'rc-progress';
import styled from 'styled-components';
import { targetedChain, targetedChainId } from '../../../constants/chains';
import { useActiveWeb3React } from '../../../hooks/useWeb3';
import { getEtherscanLink } from '../../../utils/externalLink';
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

const StarPosition = styled.span`
  display: inline-block;
  position: absolute;
  top: 58%;
  right: 1%;
  font-size: 2.5rem;
  z-index: 100;
`;

type Props = {
  totalProvided: number;
  interimGoalAmount: number;
  finalGoalAmount: number;
  providedTokenSymbol: CryptoCurrency;
  fiatSymbol: FiatCurrency;
  fiatRate: number;
  contractAddress: string;
  isStarting: boolean;
};

export default function StatisticsInCircle({
  totalProvided,
  interimGoalAmount,
  finalGoalAmount,
  providedTokenSymbol,
  fiatSymbol,
  fiatRate,
  contractAddress,
  isStarting,
}: Props) {
  const { chainId } = useActiveWeb3React();
  const isDifferentialNetwork = !(targetedChainId === chainId);

  function getTargetPercetage() {
    if (finalGoalAmount <= 0) {
      return 0;
    }
    return (totalProvided / finalGoalAmount) * 100;
  }

  function getFiatConversionAmount(token: number) {
    return token * fiatRate;
  }

  return (
    <LeftCirclePosition>
      <ExternalLink
        href={getEtherscanLink(
          chainId ?? targetedChainId,
          contractAddress,
          'address'
        )}
      >
        <Circle
          percent={getTargetPercetage()}
          strokeWidth={4}
          strokeColor="#D3D3D3"
        />
        <StarPosition>
          <StarTwoTone />
        </StarPosition>
        <InnerPosition>
          <h3
            style={{
              fontSize: '2rem',
            }}
          >
            Total Provided
          </h3>
          <div
            style={{
              fontSize: '3rem',
              lineHeight: '3.5rem',
            }}
          >
            {isStarting && !isDifferentialNetwork
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
            {isStarting && !isDifferentialNetwork
              ? '' +
                formatPrice(getFiatConversionAmount(totalProvided), fiatSymbol)
                  .value
              : '????'}
          </span>
          <div
            style={{
              textAlign: 'center',
              fontSize: '1rem',
              marginTop: '10px',
            }}
          >
            {!!interimGoalAmount && !isDifferentialNetwork ? (
              <>
                目標 {interimGoalAmount}
                {providedTokenSymbol.toUpperCase()} {' 以上'}
                {totalProvided >= interimGoalAmount ? 'を達成しました🎉' : ''}
              </>
            ) : (
              <p
                style={{
                  color: 'black',
                }}
              >
                {targetedChain}に接続してください。
              </p>
            )}
          </div>
        </InnerPosition>
      </ExternalLink>
    </LeftCirclePosition>
  );
}
