import { getAddress } from '@ethersproject/address';
import { Web3Provider } from '@ethersproject/providers';
import { ethers } from 'ethers';
import { BulksaleV1Args, templateNames } from '../constants/contracts';

// returns the checksummed address if the address is valid, otherwise returns false
export function isAddress(value: any): string | false {
  try {
    return getAddress(value);
  } catch {
    return false;
  }
}

// shorten the checksummed version of the input address to have 0x + 4 characters at start and end
export function shortenAddress(address: string, chars = 4): string {
  const parsed = isAddress(address);
  if (!parsed) {
    throw Error(`Invalid 'address' parameter '${address}'.`);
  }
  return `${parsed.substring(0, chars + 2)}...${parsed.substring(42 - chars)}`;
}

export function parseEther(ether: string) {
  return ethers.utils.parseEther(ether);
}

export function formatEther(wei: ethers.BigNumberish) {
  return ethers.utils.formatEther(wei);
}

// ref: BulksaleFactory/test/index.test.ts
export function getAbiArgs(templateName: string, args: BulksaleV1Args) {
  let types;
  let values;
  if (templateName == templateNames[0]) {
    types = [
      'address',
      'uint',
      'uint',
      'uint',
      'uint',
      'uint',
      'uint',
      'address',
      'uint',
    ];
    values = [
      args.token,
      args.start,
      args.eventDuration,
      args.lockDuration,
      args.expirationDuration,
      args.sellingAmount,
      args.minEtherTarget,
      args.owner,
      args.feeRatePerMil,
    ];
  }

  if (!types || !values) {
    return;
  }

  const codec = new ethers.utils.AbiCoder();
  return codec.encode(types, values);
}

export function getLibrary(provider: any): Web3Provider {
  const library = new Web3Provider(
    provider,
    typeof provider.chainId === 'number'
      ? provider.chainId
      : typeof provider.chainId === 'string'
      ? parseInt(provider.chainId)
      : 'any'
  );
  library.pollingInterval = 15_000;
  return library;
}
