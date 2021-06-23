import { useApolloClient } from '@apollo/client';
import { useState } from 'react';
import { EVENT_INFO_QUERY } from '../../../../apollo/query';
import { targetedChainId } from '../../../../constants/chains';
import { useFirstEventContract } from '../../../../hooks/useContract';
import useInterval from '../../../../hooks/useInterval';
import { useActiveWeb3React } from '../../../../hooks/useWeb3';
import { mockData } from '../../../../pages/event/id';
import {
  getOracleUrlForFiatPriceOfToken,
  getTokenName,
} from '../../../../utils/prices';
import { formatEther } from '../../../../utils/web3';
import { H1, Description, Grid } from '../../../Layout';
import CalendarInCircle from '../../countdown-calendar/CalendarInCircle';
import PersonalStatistics from '../../statistics/PersonalStatistics';
import StatisticsInCircle from '../../statistics/StatisticsInCircle';
import InputForm from './InputForm';

const enableSubgraph: boolean = process.env.REACT_APP_ENABLE_SUBGRAPH
  ? process.env.REACT_APP_ENABLE_SUBGRAPH.toLowerCase() === 'true'
  : false;

type Props = { data: typeof mockData };

export default function BulksaleV1(props: Props) {
  const client = useApolloClient();
  const { account, active, chainId } = useActiveWeb3React();

  // event info
  const contract = useFirstEventContract();
  const [copiedInputNumber, setCopiedInputNumber] = useState(0);
  const [totalProvided, setTotalProvided] = useState(0);
  const [myTotalProvided, setMyTotalProvided] = useState(0);
  const [fiatRate, setFiatRate] = useState(0);
  const isStarting = props.data.eventSummary.unixStartDate * 1000 <= Date.now();
  const isEnding = props.data.eventSummary.unixEndDate * 1000 < Date.now();

  // get Total Provided and Personal Donation.
  useInterval(() => {
    try {
      if (!active || targetedChainId !== chainId) {
        enableSubgraph && getStateFromSubgraph();
        return;
      }
      getStatesFromContract();
    } catch (error) {
      console.error(error);
    }
  }, 5000);

  // get Fiat Rate.
  useInterval(() => {
    if (totalProvided === 0 && fiatRate > 0) {
      // Skip because it is unnecessary.
      return;
    }

    const donatedTokenName = getTokenName(
      props.data.eventSummary.providedTokenSymbol
    );
    const oracleUrl = getOracleUrlForFiatPriceOfToken(
      donatedTokenName,
      props.data.eventSummary.fiatSymbol
    );
    // The coin gecko seems to update its price every 60 seconds.
    fetch(oracleUrl)
      .then((response) => response.json())
      .then((body) => {
        setFiatRate(body[donatedTokenName][props.data.eventSummary.fiatSymbol]);
      });
  }, 30000);

  function getStatesFromContract() {
    if (active && contract && account) {
      contract.totalProvided().then((state) => {
        console.log('totalProvided', formatEther(state));
        setTotalProvided(Number(formatEther(state)));
      });
      contract.provided(account).then((state) => {
        console.log('myTotalProvided', formatEther(state));
        setMyTotalProvided(Number(formatEther(state)));
      });
    }
  }

  function getStateFromSubgraph() {
    client
      .query({
        query: EVENT_INFO_QUERY,
        variables: {
          id: props.data.eventSummary.contractAddress.toLowerCase(),
        },
      })
      .then((result) => {
        console.log('subgraph', result);
        setTotalProvided(
          Number(formatEther(result.data.eventInfo.totalProvided))
        );
      });
  }

  return (
    <>
      <H1 style={{ marginTop: '16px' }}>{props.data.eventSummary.title}</H1>

      <Description>
        {props.data.eventSummary.organizer}{' '}
        {/* <code className={styles.code}></code> */}
      </Description>

      <Description>{props.data.eventSummary.description} </Description>

      <Grid>
        <StatisticsInCircle
          totalProvided={totalProvided}
          goalAmount={props.data.eventSummary.goalAmount}
          providedTokenSymbol={props.data.eventSummary.providedTokenSymbol}
          fiatSymbol={props.data.eventSummary.fiatSymbol}
          fiatRate={fiatRate}
          contractAddress={props.data.eventSummary.contractAddress}
          isStarting={isStarting}
        ></StatisticsInCircle>

        <CalendarInCircle
          unixStartDate={props.data.eventSummary.unixStartDate}
          unixEndDate={props.data.eventSummary.unixEndDate}
        ></CalendarInCircle>
      </Grid>

      <InputForm
        isStarting={isStarting}
        isEnding={isEnding}
        myTotalProvided={myTotalProvided}
        providedTokenSymbol={props.data.eventSummary.providedTokenSymbol}
        setCopiedInputNumber={setCopiedInputNumber}
      ></InputForm>

      {isStarting && (
        <PersonalStatistics
          inputValue={copiedInputNumber}
          myTotalProvided={myTotalProvided}
          totalProvided={totalProvided}
          totalDistributeAmount={props.data.eventSummary.totalDistributeAmount}
          distributedTokenSymbol={
            props.data.eventSummary.distributedTokenSymbol
          }
          providedTokenSymbol={props.data.eventSummary.providedTokenSymbol}
          isEnding={isEnding}
        ></PersonalStatistics>
      )}
    </>
  );
}
