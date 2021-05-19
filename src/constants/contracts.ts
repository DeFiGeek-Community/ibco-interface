// TODO: build per environment
const FactoryAddressLinkeby = '0x2EE46278E7AFbA775000Fd818c02705e84c18795';
export const FACTORY_CONTRACT_ADDRESS = FactoryAddressLinkeby;

const TemplatesMapLinkeby: { [templateAddress: string]: string } = {
  '0x7F251A6c7d6343ec0a46C14690920AA6C7C0d8a6': 'BulksaleV1.0.sol',
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
