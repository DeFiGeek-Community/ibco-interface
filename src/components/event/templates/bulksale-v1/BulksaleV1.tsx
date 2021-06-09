import { Button, Form, Input, message } from 'antd';
import { useState } from 'react';
import { targetedChain } from '../../../../constants/chains';
import { useFirstEventContract } from '../../../../hooks/useContract';
import useInterval from '../../../../hooks/useInterval';
import { useActiveWeb3React } from '../../../../hooks/useWeb3';
import { mockData } from '../../../../pages/event/id';
import {
  getOracleUrlForFiatPriceOfToken,
  getTokenName,
} from '../../../../utils/prices';
import { formatEther, parseEther } from '../../../../utils/web3';
import { H1, Description, Grid } from '../../../Layout';
import CalendarInCircle from '../../countdown-calendar/CalendarInCircle';
import PersonalStatistics from '../../statistics/PersonalStatistics';
import StatisticsInCircle from '../../statistics/StatisticsInCircle';

type Props = { data: typeof mockData };

export default function BulksaleV1(props: Props) {
  const { library, account, active } = useActiveWeb3React();
  const contract = useFirstEventContract();

  const [number, setNumber] = useState(0);
  const [totalProvided, setTotalProvided] = useState(0);
  const [myTotalProvided, setMyTotalProvided] = useState(0);
  const [fiatRate, setFiatRate] = useState(0);

  const isStarting = props.data.eventSummary.unixStartDate * 1000 <= Date.now();
  const isEnding = props.data.eventSummary.unixEndDate * 1000 < Date.now();

  // get Total Provided and Personal Donation.
  useInterval(() => {
    if (!active) {
      // use the graph.
      return;
    }
    getStatesFromContract();
  }, 5000);

  // get Fiat Rate.
  useInterval(() => {
    if (!totalProvided) {
      return;
    }

    const donatedTokenName = getTokenName(
      props.data.eventSummary.providedTokenSymbol
    );
    const oracleUrl = getOracleUrlForFiatPriceOfToken(
      donatedTokenName,
      props.data.eventSummary.fiatSymbol
    );
    // coin geckoのデータの変更間隔は60秒毎っぽい
    fetch(oracleUrl)
      .then((response) => response.json())
      .then((body) => {
        console.log('coin gecko', body);
        setFiatRate(body[donatedTokenName][props.data.eventSummary.fiatSymbol]);
      });
  }, 30000);

  const onNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newNumber = Number(e.target.value || '0');
    if (Number.isNaN(newNumber)) {
      setNumber(0);
      return;
    }
    setNumber(newNumber);
  };

  async function onFinish(values: any) {
    if (!active || !account) {
      message.error(`ウォレットを接続してください。`);
      return;
    }
    if (!contract || !library) {
      message.error(`ネットワークを${targetedChain}に接続してください。`);
      return;
    }

    const signer = library.getSigner();
    try {
      signer
        .sendTransaction({
          to: contract.address,
          value: parseEther(values.price),
        })
        .then((res: any) => {
          console.log('donation result', res);
          message.info(`作成しました！　${res}`);
        })
        .catch((error: any) => {
          console.error('donation failed!', error);
          if (
            error.message &&
            (error.message as string).search('The offering has not started yet')
          ) {
            message.warning(`まだ始まっていません。`);
            return;
          }
          if (
            error.message &&
            (error.message as string).search('The offering has already ended')
          ) {
            message.warning(`終了しました。`);
            return;
          }

          message.warning(
            `作成できませんでした。。　${error.message.substring(0, 20)}...`
          );
        });
    } catch (error) {
      console.error('donation error!', error);
      message.error(
        `エラーが発生しました。。　${error.message.substring(0, 20)}...`
      );
    }
  }

  function checkPrice(_: any, value: number) {
    if (number > 0) {
      return Promise.resolve(value);
    }
    return Promise.reject('Price must be greater than zero!');
  }

  function getStatesFromContract() {
    if (active && contract && account) {
      contract.totalProvided().then((state) => {
        console.log('get state of totalProvided', state.toNumber());
        setTotalProvided(Number(formatEther(state)));
      });
      contract
        .provided(account)
        .then((state) => setMyTotalProvided(Number(formatEther(state))));
    }
  }

  return (
    <>
      <H1>{props.data.eventSummary.title}</H1>

      <Description>
        {props.data.eventSummary.organizer}{' '}
        {/* <code className={styles.code}></code> */}
      </Description>

      <Description>{props.data.eventSummary.description} </Description>

      <Grid>
        <StatisticsInCircle
          totalProvided={totalProvided}
          minimalProvideAmount={props.data.eventSummary.minimalProvideAmount}
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

      {isStarting && !isEnding && (
        <Grid>
          <Form
            name="fundraiser_form_controls"
            layout="inline"
            onFinish={onFinish}
          >
            <Form.Item name="price" rules={[{ validator: checkPrice }]}>
              <Input
                type="text"
                value={number}
                onChange={onNumberChange}
                style={{
                  width: '300px',
                  textAlign: 'right',
                  color: 'black',
                  backgroundColor: 'white',
                }}
              />
            </Form.Item>
            <Form.Item>
              {props.data.eventSummary.providedTokenSymbol.toUpperCase()}
            </Form.Item>
            <Form.Item>
              <Button type="primary" shape="round" htmlType="submit">
                寄付する
              </Button>
            </Form.Item>
          </Form>
        </Grid>
      )}

      {isStarting && (
        <PersonalStatistics
          inputValue={number}
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
