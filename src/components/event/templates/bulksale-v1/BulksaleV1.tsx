import { Button, Form, Input, message, notification } from 'antd';
import { useState } from 'react';
import { isMobile } from 'react-device-detect';
import { targetedChain, targetedChainId } from '../../../../constants/chains';
import { useFirstEventContract } from '../../../../hooks/useContract';
import useInterval from '../../../../hooks/useInterval';
import { useActiveWeb3React } from '../../../../hooks/useWeb3';
import { mockData } from '../../../../pages/event/id';
import { useEndTx, useStartTx } from '../../../../state/application/hooks';
import { getEtherscanLink } from '../../../../utils/externalLink';
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
  const { library, account, active, chainId } = useActiveWeb3React();
  const contract = useFirstEventContract();
  const [form] = Form.useForm();

  // event info
  const [copiedInputNumber, setCopiedInputNumber] = useState(0);
  const [totalProvided, setTotalProvided] = useState(0);
  const [myTotalProvided, setMyTotalProvided] = useState(0);
  const [fiatRate, setFiatRate] = useState(0);
  const isStarting = props.data.eventSummary.unixStartDate * 1000 <= Date.now();
  const isEnding = props.data.eventSummary.unixEndDate * 1000 < Date.now();

  // handle loading status
  const startTx = useStartTx();
  const endTx = useEndTx();

  // get Total Provided and Personal Donation.
  useInterval(() => {
    if (!active || targetedChainId !== chainId) {
      // use the graph per chain network
      return;
    }

    try {
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

  async function onFinish(values: any) {
    if (!active || !account || !library) {
      message.error(`ウォレットを接続してください。`);
      return;
    }
    if (targetedChainId !== chainId || !contract) {
      message.error(`ネットワークを${targetedChain}に接続してください。`);
      return;
    }

    try {
      startTx();

      const signer = library.getSigner();
      const res = await signer.sendTransaction({
        to: contract.address,
        value: parseEther(values.price),
      });

      console.log('donation result', res);
      notification.success({
        message: '寄付しました！',
        description: `${res.hash} 寄付額への反映は数confirmation後になります。`,
        onClick: () => {
          window.open(
            getEtherscanLink(chainId!, res.hash, 'address'),
            '_blank'
          );
        },
      });

      // reset
      form.resetFields();
      setCopiedInputNumber(0);
    } catch (error) {
      console.error('donation failed!', error);
      if (error.message) {
        if (
          (error.message as string).search('The offering has not started') > -1
        ) {
          message.warning(`まだ始まっていません。`, 5);
          return;
        }
        if (
          (error.message as string).search('The offering has already ended') >
          -1
        ) {
          message.warning(`終了しました。`, 5);
          return;
        }
        if ((error.message as string).search('insufficient funds') > -1) {
          message.warning(`残高が足りません。`, 5);
          return;
        }
      }

      notification.error({
        message: 'エラーが発生しました。。',
        description: error.messages,
      });
    } finally {
      endTx();
    }
  }

  async function claim() {
    if (!active || !account || !library) {
      message.error(`ウォレットを接続してください。`, 5);
      return;
    }
    if (targetedChainId !== chainId || !contract) {
      message.error(`ネットワークを${targetedChain}に接続してください。`, 5);
      return;
    }
    if (myTotalProvided <= 0) {
      message.info(`あなた（${account}）の寄付額は0です。`, 5);
      return;
    }

    try {
      startTx();

      const signer = contract.connect(library.getSigner());
      const res = await signer.claim();

      console.log('claim result', res);
      notification.success({
        message: '請求しました！　',
        description: `${res.hash}`,
        onClick: () => {
          window.open(
            getEtherscanLink(chainId!, res.hash, 'address'),
            '_blank'
          );
        },
      });
    } catch (error) {
      console.error('claim error!', error);
      notification.error({
        message: 'エラーが発生しました。。',
        description: error.messages,
      });
    } finally {
      endTx();
    }
  }

  function copyInputValue(e: React.ChangeEvent<HTMLInputElement>) {
    const newNumber = getInputValue(e.target.value);
    setCopiedInputNumber(newNumber);
  }

  function checkPrice(_: any, value: string) {
    const val = getInputValue(value);
    if (val <= 0) {
      return Promise.reject('0以上を入力していください。');
    }
    if (val < 0.000000000000000001) {
      return Promise.reject('小数点は18桁までです。');
    }

    return Promise.resolve(val);
  }

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

  function getInputValue(value: any): number {
    const val = value ?? 0;
    let newVal = 0;
    try {
      newVal = Number(val);
      if (Number.isNaN(newVal)) {
        newVal = 0;
      }
    } catch (error) {
      newVal = 0;
    }
    return newVal;
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

      {isStarting && !isEnding && (
        <Grid>
          <Form
            name="fundraiser_form_controls"
            layout="inline"
            form={form}
            onFinish={onFinish}
          >
            <Form.Item name="price" rules={[{ validator: checkPrice }]}>
              <Input
                type="text"
                style={{
                  width: !isMobile ? '300px' : '100%',
                  textAlign: 'right',
                  color: 'black',
                  backgroundColor: 'white',
                }}
                onChange={copyInputValue}
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

      {isEnding && (
        <Grid>
          <Button
            type="primary"
            shape="round"
            htmlType="button"
            onClick={claim}
          >
            請求する
          </Button>
        </Grid>
      )}

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
