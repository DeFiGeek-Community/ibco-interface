import { getUnixTime } from 'date-fns';
import { zonedTimeToUtc } from 'date-fns-tz';
import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { useLocation } from 'react-router-dom';
import backgroundImage from '../../assets/images/background_sky-min.png';
import Footer from '../../components/Footer';
import { Container, Main } from '../../components/Layout';
import BulksaleV1 from '../../components/event/templates/bulksale-v1/BulksaleV1';
import Web3Status from '../../components/wallet-connect-button';
import {
  FIRST_EVENT_CONTRACT_ADDRESS,
  templateNames,
  TemplatesMap,
} from '../../constants/contracts';

// note: Master data for first event.
export const masterDataForFirstEvent = {
  title: 'フェーズ１寄付イベント（シードラウンド）',
  organizer: 'Presented by DeFiGeek Community JAPAN',
  description: '',
  interimGoalAmount: 300, // ETH
  finalGoalAmount: 1000, // ETH
  providedTokenSymbol: 'eth' as const,
  distributedTokenSymbol: 'txjp' as const,
  fiatSymbol: 'jpy' as const,
  referenceList: {
    forum: 'https://gov.defigeek.xyz/',
    discord: 'https://discord.gg/FQYXqVBEnh',
    github: 'https://github.com/DeFiGeek-Community',
  },
  contractAddress: FIRST_EVENT_CONTRACT_ADDRESS,
  templateAddress: Object.keys(TemplatesMap)[0],
  logoUrl: '/favicon.ico',
};
// note: The states in contract. For development.
export const mockData = {
  eventSummary: {
    ...masterDataForFirstEvent,
    unixStartDate: getUnixTime(
      zonedTimeToUtc('2021-07-09 12:00', 'Asia/Tokyo')
    ), // unixTime
    unixEndDate: getUnixTime(zonedTimeToUtc('2021-07-14 21:00', 'Asia/Tokyo')), // unixTime
    totalDistributeAmount: 36000, // TXJP
  },
  // totalProvided: 0, // ETH
  // myTotalProvided: 0, // ETH
};

export default function EventDetail() {
  const [eventAddress, setEventAddress] = useState('');
  const [templateAddress, setTemplateAddress] = useState('');
  const [data, setData] = useState<typeof mockData>({} as any); // TODO: 型
  const location = useLocation();

  // Get the event ID from URL, and get event detail via web3.
  useEffect(() => {
    // get the event ID and save it
    // TODO: security
    const eventAddress = location.pathname.replace('/event/', '');
    setEventAddress(eventAddress);
    // check whether wallet connects
    // get template address
    // TODO: get the binary from contractAddress via etherscan, and extract template contract address from it.
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
      <Helmet title={masterDataForFirstEvent.title} />

      <div style={{ textAlign: 'right', width: '100%', padding: '16px 16px' }}>
        <Web3Status />
      </div>

      <Main
        style={{
          background: `url(${backgroundImage}) no-repeat center top scroll`,
          backgroundSize: 'auto 100%',
        }}
      >
        {selectTemplate()}
      </Main>

      <Footer referenceList={masterDataForFirstEvent.referenceList}></Footer>
    </Container>
  );
}
