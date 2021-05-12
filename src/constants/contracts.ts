// TODO: build per environment
const FactoryAddressLinkeby = '0xC54Cd792103bF4DdAE80570bEB7842Cb29ED2238';
export const FACTORY_CONTRACT_ADDRESS = FactoryAddressLinkeby;

const TemplatesMapLinkeby: { [templateAddress: string]: string } = {
  '0xFF3B1A13eceff8e564a59d2BdF13BF4567771c92': 'BulksaleV1',
};
export const TemplatesMap = TemplatesMapLinkeby;

// ref: BulksaleFactory/contracts/BulksaleV1.sol
export type BulksaleV1Args = {
  token: string;
  start: number;
  eventDuration: number;
  lockDuration: number;
  expirationDuration: number;
  sellingAmount: number;
  minEtherTarget: number;
  owner: string;
  feeRatePerMil: number;
};
