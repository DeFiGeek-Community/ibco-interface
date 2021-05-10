/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-empty-function */
import { createContext } from 'react';

export const WalletContext = createContext({
  isLoading: false,
  isConnected: false,
  address: '',
  handleSetIsLoading: (isLoading: boolean) => {},
  handleSetIsConnected: (isConnected: boolean) => {},
  handleSetAddress: (address: string) => {},
});
