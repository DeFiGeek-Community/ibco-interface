export const COINGECKO_URL = 'https://api.coingecko.com/api/v3/simple/price';

const etherscanApiUrl = 'https://api.etherscan.io/api';
const rinkebyEtherscanApiUrl = 'https://api-rinkeby.etherscan.io/api';
export const ETHERSCAN_API_URL =
  process.env.REACT_APP_CHAIN === 'mainnet'
    ? etherscanApiUrl
    : rinkebyEtherscanApiUrl;

const subgraphName = 'TXJP_IBCO-1';
const rinkebySubgraphName = 'ibco-test-1';
export const SUBGRAPH_HTTP_ENDPOINT = `https://api.thegraph.com/subgraphs/name/0xteatwo/${
  process.env.REACT_APP_CHAIN === 'mainnet' ? subgraphName : rinkebySubgraphName
}`;
export const SUBGRAPH_WSS_ENDPOINT = `wss://api.thegraph.com/subgraphs/name/0xteatwo/${
  process.env.REACT_APP_CHAIN === 'mainnet' ? subgraphName : rinkebySubgraphName
}`;
