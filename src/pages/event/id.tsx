import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { useLocation } from 'react-router-dom';
import Footer from '../../components/Footer';
import { Container, Main } from '../../components/Layout';
import BulksaleV1 from '../../components/event/templates/bulksale-v1/BulksaleV1';
import Web3Status from '../../components/wallet/ConnectButton';
import { templateNames, TemplatesMap } from '../../constants/contracts';

// note: 初回イベント用の埋め込みマスターデータ
export const masterDataForFirstEvent = {
  title: '[2021年7月の寄付イベント名]',
  organizer: 'Presented by DeFiGeek Community JAPAN',
  description: '説明説明説明',
  donatedTokenSymbol: 'eth' as const, // 寄付するトークンのシンボル
  providedTokenSymbol: 'txjp' as const, // 配布するトークンのシンボル
  fiatSymbol: 'jpy' as const,
  referenceList: {
    forum: 'https://gov.defigeek.xyz/',
    discord: 'https://discord.gg/FQYXqVBEnh',
    github: 'https://github.com/DeFiGeek-Community',
  },
  contractAddress: '0x650c1D6aCD5eb4d07Bd68e91Dd898BfAECbbA9cA',
  templateAddress: Object.keys(TemplatesMap)[0],
  logoUrl: '/favicon.ico',
};
// note: 開発中に用いるデータ。contractと繋げたら削除すること。
export const mockData = {
  eventSummary: {
    ...masterDataForFirstEvent,
    unixStartDate: Math.floor(new Date(2021, 6, 9, 12).getTime() / 1000), // 開始日時。unixTime形式
    unixEndDate: Math.floor(new Date(2021, 6, 14, 23, 59).getTime() / 1000), // 終了日時。unixTime形式
    totalProvidedTokens: 36000, // 配布トークン数
    targetFigure: 1000, // 目標額
    minTargetFigure: 100, // 最小到達額
  },
  totalDonations: 270.1234567891, // 全体の寄付総額
  myTotalDonations: 1.8, // 当アカウントの寄付総額
};

export default function EventDetail() {
  const [eventAddress, setEventAddress] = useState('');
  const [templateAddress, setTemplateAddress] = useState('');
  const [data, setData] = useState<any>({}); // TODO: 型
  const location = useLocation();

  // Get the event ID from URL, and get event detail via wallet.
  useEffect(() => {
    console.log('get contract address!', location.hash);
    // get the event ID and save it
    // TODO: security
    const eventAddress = location.hash.replace('#/event/', '');
    setEventAddress(eventAddress);
    // check whether wallet connects
    // get template address
    // TODO: etherscanからcontractAddessのバイナリを取得して、そこから取り出す
    setTemplateAddress(mockData.eventSummary.templateAddress);
    // get event detail
    setData(mockData);
  }, []);

  const selectTemplate = () => {
    switch (TemplatesMap[templateAddress]) {
      case templateNames[0]:
        return <BulksaleV1 data={data}></BulksaleV1>;
      default:
        return (
          <div>
            <p style={{ textAlign: 'center' }}>ウォレットを接続してください</p>
          </div>
        );
    }
  };

  return (
    <Container>
      <Helmet>
        <title>{masterDataForFirstEvent.title}</title>
        <link rel="icon" href={masterDataForFirstEvent.logoUrl} />
      </Helmet>

      <div
        style={{ textAlign: 'right', width: '100%', padding: '24px 24px 0' }}
      >
        <Web3Status />
      </div>

      <Main>{selectTemplate()}</Main>

      <Footer referenceList={masterDataForFirstEvent.referenceList}></Footer>
    </Container>
  );
}
