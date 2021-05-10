import { Button, Form, Input } from 'antd';
import { useState } from 'react';
import { Helmet } from 'react-helmet';
import useInterval from '../../../../hooks/useInterval';
import { getTokenName } from '../../../../utils/prices';
import Footer from '../../../Footer';
import { Container, Main, H1, Description, Grid } from '../../../Layout';
import CalendarInCircle from '../../countdown-calendar/CalendarInCircle';
import StatisticsInCircle from '../../statistics/StatisticsInCircle';
import PersonalStatistics from './PersonalStatistics';

// note: 開発中に用いるデータ。contractと繋げたら削除すること。
export const mockData = {
  eventSummary: {
    title: '[2021年4月の寄付イベント名]',
    organizer: 'Presented by DeFiGeek Community JAPAN',
    description: '説明説明説明',
    unixStartDate: Math.floor(new Date(2021, 2, 10).getTime() / 1000), // 開始日時。unixTime形式
    unixEndDate: Math.floor(new Date(2021, 3, 30).getTime() / 1000), // 終了日時。unixTime形式
    totalProvidedTokens: 3600, // 配布トークン数
    targetFigure: 10000, // 目標額
    minTargetFigure: 100, // 最小到達額
    donatedTokenSymbol: 'eth' as const, // 寄付するトークンのシンボル
    providedTokenSymbol: 'txjp' as const, // 配布するトークンのシンボル
    fiatSymbol: 'jpy' as const,
    referenceList: {
      forum: 'https://gov.defigeek.xyz/',
      discord: 'https://discord.gg/FQYXqVBEnh',
      github: 'https://github.com/DeFiGeek-Community',
    },
  },
  totalDonations: 1070.1234567891, // 全体の寄付総額
  myTotalDonations: 1.8, // 当アカウントの寄付総額
};
const donatedTokenName = getTokenName(mockData.eventSummary.donatedTokenSymbol);
const oracleUrl = `https://api.coingecko.com/api/v3/simple/price?ids=${donatedTokenName}&vs_currencies=${mockData.eventSummary.fiatSymbol}`;

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

  useInterval(() => {
    // coin geckoのデータの変更間隔は60秒毎っぽい
    fetch(oracleUrl)
      .then((response) => response.json())
      .then((body) => {
        console.log('coin gecko', body);
        setFiatRate(body[donatedTokenName][mockData.eventSummary.fiatSymbol]);
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
            minTargetFigure={mockData.eventSummary.minTargetFigure}
            donatedTokenSymbol={mockData.eventSummary.donatedTokenSymbol}
            fiatSymbol={mockData.eventSummary.fiatSymbol}
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
            <Form.Item>
              {mockData.eventSummary.donatedTokenSymbol.toUpperCase()}
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
          myTotalDonations={mockData.myTotalDonations}
          totalProvidedToken={mockData.eventSummary.totalProvidedTokens}
          totalDonations={mockData.totalDonations}
          providedTokenSymbol={mockData.eventSummary.providedTokenSymbol}
          donatedTokenSymbol={mockData.eventSummary.donatedTokenSymbol}
        ></PersonalStatistics>
      </Main>

      <Footer referenceList={mockData.eventSummary.referenceList}></Footer>
    </Container>
  );
}
