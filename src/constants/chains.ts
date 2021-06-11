export enum SupportedChainId {
  MAINNET = 1,
  ROPSTEN = 3,
  RINKEBY = 4,
  GOERLI = 5,
  KOVAN = 42,
  ARBITRUM_KOVAN = 144545313136048,
  ARBITRUM_ONE = 42161,
}

export const ChainIdMap = {
  1: 'MAINNET',
  3: 'ROPSTEN',
  4: 'RINKEBY',
  5: 'GOERLI',
  42: 'KOVAN',
  144545313136048: 'ARBITRUM_KOVAN',
  42161: 'ARBITRUM_ONE',
} as const;
export const ChainIds = Object.keys(ChainIdMap);
export const ChainNames = Object.values(ChainIdMap);

export const targetedChain = process.env.REACT_APP_CHAIN;
export const targetedChainId =
  targetedChain && SupportedChainId[targetedChain.toUpperCase() as any];
