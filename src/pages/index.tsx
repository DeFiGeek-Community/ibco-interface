import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import Footer from '../components/Footer';
import { Container, Main, H1, Description } from '../components/Layout';
import { mockData } from '../components/event/templates/bulksale-v1/BulksaleV1';

export default function Index() {
  return (
    <Container>
      <Helmet>
        <title>The tool to build easily a Bulk Auction</title>
        {/* ロゴができたら差し替える */}
        <link rel="icon" href="/favicon.ico" />
      </Helmet>

      <Main>
        <H1>The tool to build easily a Bulk Auction</H1>

        <Description>event list</Description>

        <Link to="/event/1">{mockData.eventSummary.title}</Link>
      </Main>

      <Footer></Footer>
    </Container>
  );
}
