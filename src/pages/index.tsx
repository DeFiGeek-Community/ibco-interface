import { Button } from 'antd';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import Footer from '../components/Footer';
import { Container, Main, H1, Description } from '../components/Layout';
import { mockData } from './event/id';

export default function Index() {
  return (
    <Container>
      <Helmet title="The tool to build easily a Bulk Auction" />

      <Main>
        <H1>The tool to build easily a Bulk Auction</H1>

        <div style={{ textAlign: 'center', width: '100%', margin: '24px' }}>
          <Link to={`/event-editor/create`}>
            <Button type="primary">create new event</Button>
          </Link>
        </div>

        <Description>event list</Description>

        <Link to={`/event/${mockData.eventSummary.contractAddress}`}>
          {mockData.eventSummary.title}
        </Link>
      </Main>

      <Footer></Footer>
    </Container>
  );
}
