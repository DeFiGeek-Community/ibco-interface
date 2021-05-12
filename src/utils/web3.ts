import { ethers } from 'ethers';
import { BulksaleV1Args } from '../constants/contracts';

// ref: BulksaleFactory/test/index.test.ts
export function getAbiArgs(templateName: string, args: BulksaleV1Args) {
  let types;
  let values;
  if (templateName == 'BulksaleV1') {
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
