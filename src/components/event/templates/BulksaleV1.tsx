import { Button, Form, Input } from 'antd';
import { useState } from 'react';
import { Helmet } from 'react-helmet';
import useInterval from '../../../hooks/useInterval';
import { formatPrice } from '../../../utils/prices';
import Footer from '../../Footer';
import { Container, Main, H1, Description, Grid } from '../../Layout';
import CalendarInCircle from '../countdown-calendar/CalendarInCircle';
import StatisticsInCircle from '../statistics/StatisticsInCircle';

export default function BulksaleV1() {
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

  const getExpectedTxjpAmount = (
    myTotalDonations: number,
    inputtingValue: number
  ) => {
    let donations = 0;
    if (!Number.isNaN(myTotalDonations)) {
      donations += myTotalDonations;
    }
    if (!Number.isNaN(inputtingValue)) {
      donations += inputtingValue;
    }

    return (
      (donations / mockData.totalDonations) *
      mockData.eventSummary.totalProvidedToken
    );
  };

  useInterval(() => {
    // coin geckoのデータの変更間隔は60秒毎っぽい
    fetch(oracleUrl)
      .then((response) => response.json())
      .then((body) => {
        console.log('coin gecko', body);
        setFiatRate(body[donatedTokenName][fiatSymbolLowerCase]);
      });
  }, 30000);

  return (
    <Container>
      <Helmet>
        <title>{mockData.eventSummary.title}</title>
        {/* ロゴができたら差し替える */}
        <link rel="icon" href="/favicon.ico" />
      </Helmet>

      <Main>
        <H1>{mockData.eventSummary.title}</H1>

        <Description>
          {mockData.eventSummary.organizer}{' '}
          {/* <code className={styles.code}></code> */}
        </Description>

        <Description>{mockData.eventSummary.description} </Description>

        <Grid>
          <StatisticsInCircle
            totalDonations={mockData.totalDonations}
            targetFigure={mockData.eventSummary.targetFigure}
            donatedTokenSymbol={donatedTokenSymbolLowerCase}
            fiatSymbol={fiatSymbolLowerCase}
            fiatRate={fiatRate}
          ></StatisticsInCircle>

          <CalendarInCircle
            unixStartDate={mockData.eventSummary.unixStartDate}
            unixEndDate={mockData.eventSummary.unixEndDate}
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
            <Form.Item>{mockData.eventSummary.donatedTokenSymbol}</Form.Item>
            <Form.Item>
              <Button type="primary" shape="round" htmlType="submit">
                寄付する
              </Button>
            </Form.Item>
          </Form>
        </Grid>

        <div style={{ marginTop: '40px', fontSize: '2em' }}>
          <p>
            {mockData.eventSummary.providedTokenSymbol}獲得予定数:{' '}
            <span style={{ fontWeight: 'bold', marginLeft: '10px' }}>
              {formatPrice(
                getExpectedTxjpAmount(mockData.myTotalDonations, number),
                providedTokenSymbolLowerCase
              )}{' '}
              TXJP
            </span>
          </p>
          <p>
            現寄付
            <span style={{ fontWeight: 'bold', marginLeft: '10px' }}>
              {formatPrice(
                mockData.myTotalDonations,
                donatedTokenSymbolLowerCase
              )}{' '}
              {mockData.eventSummary.donatedTokenSymbol}
            </span>{' '}
            + 新寄付
            <span style={{ fontWeight: 'bold', marginLeft: '10px' }}>
              {formatPrice(number, donatedTokenSymbolLowerCase)}{' '}
              {mockData.eventSummary.donatedTokenSymbol}
            </span>
          </p>
        </div>
      </Main>

      <Footer referenceList={mockData.eventSummary.referenceList}></Footer>
    </Container>
  );
}
