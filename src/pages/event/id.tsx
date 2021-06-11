import { getUnixTime } from 'date-fns';
import { zonedTimeToUtc } from 'date-fns-tz';
import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { useLocation } from 'react-router-dom';
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
  title: '[2021年7月の寄付イベント名]',
  organizer: 'Presented by DeFiGeek Community JAPAN',
  description: '説明説明説明',
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
      zonedTimeToUtc('2021-06-09 12:00', 'Asia/Tokyo')
    ), // unixTime
    unixEndDate: getUnixTime(zonedTimeToUtc('2021-07-14 21:00', 'Asia/Tokyo')), // unixTime
    totalDistributeAmount: 36000, // TXJP
    minimalProvideAmount: 300, // ETH
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
    console.log('get contract address!', location.hash);
    // get the event ID and save it
    // TODO: security
    const eventAddress = location.hash.replace('#/event/', '');
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
