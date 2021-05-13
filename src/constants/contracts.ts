// TODO: build per environment
const FactoryAddressLinkeby = '0x32Fd8cf8b7348A7F9d714DB92Fe4d44A8f9A179b';
export const FACTORY_CONTRACT_ADDRESS = FactoryAddressLinkeby;

const TemplatesMapLinkeby: { [templateAddress: string]: string } = {
  '0x247Eb9eE3D5067B6b66303564ADc94C73746036A': 'BulksaleV1',
  '0xC328a0A0A70Acec92AD9970ecD58bA6D4787785E': 'BulksaleV1.sol__1620876764',
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
