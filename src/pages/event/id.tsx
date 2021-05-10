import { useCallback, useState } from 'react';
import { WalletContext } from '../../components/contexts';
import BulksaleV1 from '../../components/event/templates/bulksale-v1/BulksaleV1';

export default function EventDetail() {
  const [isLoading, setIsLoading] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [address, setAddress] = useState('');

  const handleSetIsLoading = useCallback(
    (isLoading) => {
      setIsLoading(isLoading);
    },
    [setIsLoading]
  );
  const handleSetIsConnected = useCallback(
    (isConnected) => {
      setIsConnected(isConnected);
    },
    [setIsConnected]
  );
  const handleSetAddress = useCallback(
    (address: string) => {
      setAddress(address);
    },
    [setAddress]
  );

  return (
    <WalletContext.Provider
      value={{
        isLoading,
        isConnected,
        address,
        handleSetIsLoading,
        handleSetIsConnected,
        handleSetAddress,
      }}
    >
      <BulksaleV1></BulksaleV1>
    </WalletContext.Provider>
  );
}
