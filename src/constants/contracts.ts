import { constructSameAddressMap } from '../utils/constructSameAddressMap';
import { SupportedChainId } from './chains';

type AddressMap = { [chainId: number]: string };

/**
 * First Event
 */
const firstEventAddress = '';
const firstEventAddressRinkeby = '0x999D114147FDE648419DFDAB653959C63aE139c4';
export const FIRST_EVENT_CONTRACT_ADDRESS =
  process.env.REACT_APP_CHAIN === 'mainnet'
    ? firstEventAddress
    : firstEventAddressRinkeby;

/**
 * Factory
 */
// TODO: build per environment
const FactoryAddressRinkeby = '0x2EE46278E7AFbA775000Fd818c02705e84c18795';
export const FACTORY_CONTRACT_ADDRESS = FactoryAddressRinkeby;

/**
 * Template
 */
export const templateNames = ['BulksaleV1.0.sol', 'BulksaleV2.sol'] as const;
export type TemplateName = typeof templateNames[number];

const TemplatesMapRinkeby: { [templateAddress: string]: TemplateName } = {
  '0x7F251A6c7d6343ec0a46C14690920AA6C7C0d8a6': 'BulksaleV1.0.sol',
};
export const TemplatesMap = TemplatesMapRinkeby;

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

/**
 * ENS
 */
export const ENS_REGISTRAR_ADDRESSES: AddressMap = {
  [SupportedChainId.MAINNET]: '0x00000000000C2E074eC69A0dFb2997BA6C7d2e1e',
  [SupportedChainId.ROPSTEN]: '0x00000000000C2E074eC69A0dFb2997BA6C7d2e1e',
  [SupportedChainId.GOERLI]: '0x00000000000C2E074eC69A0dFb2997BA6C7d2e1e',
  [SupportedChainId.RINKEBY]: '0x00000000000C2E074eC69A0dFb2997BA6C7d2e1e',
};

export const MULTICALL2_ADDRESSES: AddressMap = {
  ...constructSameAddressMap(
    '0x5BA1e12693Dc8F9c48aAD8770482f4739bEeD696',
    false
  ),
  [SupportedChainId.ARBITRUM_KOVAN]:
    '0xc80e33a6f02cf08557a0ca3d94d1474d73f64bc1',
  [SupportedChainId.ARBITRUM_ONE]: '0x021CeAC7e681dBCE9b5039d2535ED97590eB395c',
};
