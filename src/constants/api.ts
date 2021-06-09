export const COINGECKO_URL = 'https://api.coingecko.com/api/v3/simple/price';

const etherscanUrl = 'https://etherscan.io/';
const rinkebyEtherscanUrl = 'https://rinkeby.etherscan.io/';
export const ETHERSCAN_URL =
  process.env.REACT_APP_CHAIN === 'mainnet'
    ? etherscanUrl
    : rinkebyEtherscanUrl;

const etherscanApiUrl = 'https://api.etherscan.io/api';
const rinkebyEtherscanApiUrl = 'https://api-rinkeby.etherscan.io/api';
export const ETHERSCAN_API_URL =
  process.env.REACT_APP_CHAIN === 'mainnet'
    ? etherscanApiUrl
    : rinkebyEtherscanApiUrl;
