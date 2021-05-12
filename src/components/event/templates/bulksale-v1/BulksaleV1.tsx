import { Button, Form, Input } from 'antd';
import { useState } from 'react';
import useInterval from '../../../../hooks/useInterval';
import { mockData } from '../../../../pages/event/id';
import {
  getOracleUrlForFiatPriceOfToken,
  getTokenName,
} from '../../../../utils/prices';
import { H1, Description, Grid } from '../../../Layout';
import CalendarInCircle from '../../countdown-calendar/CalendarInCircle';
import StatisticsInCircle from '../../statistics/StatisticsInCircle';
import PersonalStatistics from './PersonalStatistics';

type Props = { data: typeof mockData };

export default function BulksaleV1(props: Props) {
  const [number, setNumber] = useState(0);
  const [fiatRate, setFiatRate] = useState(0);
  // const { id } = useParams<{ id: string }>();

  const onNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newNumber = Number(e.target.value || '0');
    if (Number.isNaN(newNumber)) {
      setNumber(0);
      return;
    }
    console.log('セット', newNumber);
    setNumber(newNumber);
  };

  const onFinish = (values: any) => {
    console.log('Received values from form: ', values);
  };

  const checkPrice = (_: any, value: number) => {
    if (number > 0) {
      return Promise.resolve(value);
    }
    return Promise.reject('Price must be greater than zero!');
  };

  useInterval(() => {
    const donatedTokenName = getTokenName(
      props.data.eventSummary.donatedTokenSymbol
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
          totalDonations={props.data.totalDonations}
          targetFigure={props.data.eventSummary.targetFigure}
          minTargetFigure={props.data.eventSummary.minTargetFigure}
          donatedTokenSymbol={props.data.eventSummary.donatedTokenSymbol}
          fiatSymbol={props.data.eventSummary.fiatSymbol}
          fiatRate={fiatRate}
        ></StatisticsInCircle>

        <CalendarInCircle
          unixStartDate={props.data.eventSummary.unixStartDate}
          unixEndDate={props.data.eventSummary.unixEndDate}
        ></CalendarInCircle>
      </Grid>

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
              style={{ width: '300px', textAlign: 'right' }}
            />
          </Form.Item>
          <Form.Item>
            {props.data.eventSummary.donatedTokenSymbol.toUpperCase()}
          </Form.Item>
          <Form.Item>
            <Button type="primary" shape="round" htmlType="submit">
              寄付する
            </Button>
          </Form.Item>
        </Form>
      </Grid>

      <PersonalStatistics
        inputValue={number}
        myTotalDonations={props.data.myTotalDonations}
        totalProvidedToken={props.data.eventSummary.totalProvidedTokens}
        totalDonations={props.data.totalDonations}
        providedTokenSymbol={props.data.eventSummary.providedTokenSymbol}
        donatedTokenSymbol={props.data.eventSummary.donatedTokenSymbol}
      ></PersonalStatistics>
    </>
  );
}
