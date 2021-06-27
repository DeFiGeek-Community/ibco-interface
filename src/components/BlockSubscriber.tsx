import { notification } from 'antd';
import { useCallback, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { ChainId, useActiveWeb3React } from '../hooks/useWeb3';
import { AppDispatch } from '../state';
import { endTx } from '../state/application/actions';
import { usePendingTxs } from '../state/application/hooks';
import { getEtherscanLink } from '../utils/externalLink';
import { ExternalLink } from './ExternalLink';

function getContent(
  tx: {
    hash: string;
    type: 'donate' | 'claim';
  },
  chainId: ChainId
) {
  return tx.type === 'donate'
    ? {
        message: '寄付を受け付けました！',
        description: (
          <>
            <ExternalLink
              href={getEtherscanLink(chainId!, tx.hash, 'transaction')}
            >
              {tx.hash}
            </ExternalLink>
            <p>寄付額への反映は数confirmation後になります。</p>
          </>
        ),
      }
    : {
        message: '請求を受け付けました！',
        description: (
          <>
            <ExternalLink
              href={getEtherscanLink(chainId, tx.hash, 'transaction')}
            >
              {tx.hash}
            </ExternalLink>
          </>
        ),
      };
}

export default function BlockSubscriber(): null {
  const { library, chainId } = useActiveWeb3React();
  const dispatch = useDispatch<AppDispatch>();
  const pendingTxs = usePendingTxs();

  const doingTxHashes: string[] = []; // for exclusive control
  const [doneTxHashes, setDoneTxHashes] = useState<string[]>([]); // for cleanup after work
  const [blockNumber, setBlockNumber] = useState<{
    chainId: number | undefined;
    blockNumber: number | null;
  }>({
    chainId,
    blockNumber: null,
  }); // to run update cycle

  // Why not execute `getTransactionReceipt` directly? Because event listener does not keep referrence of pendingTxHashes.
  const blockNumberCallback = useCallback(
    (blockNumber: number) => {
      setBlockNumber((state) => {
        if (chainId === state.chainId) {
          if (typeof state.blockNumber !== 'number')
            return { chainId, blockNumber };
          return {
            chainId,
            blockNumber: Math.max(blockNumber, state.blockNumber),
          };
        }
        return state;
      });
    },
    [chainId, setBlockNumber]
  );

  useEffect(() => {
    if (pendingTxs.length === 0) {
      library && library.off('block', blockNumberCallback);
      return undefined;
    }

    // Assert just 1 to avoid to duplicate subscriber.
    if (pendingTxs.length === 1) {
      if (!library) {
        return undefined;
      }
      if (library.listenerCount('block') === 0) {
        library.on('block', blockNumberCallback);
      }
    }
  }, [pendingTxs, blockNumberCallback, library, dispatch]);

  useEffect(() => {
    if (
      pendingTxs.length === 0 ||
      !library ||
      !chainId ||
      blockNumber.chainId !== chainId
    ) {
      return undefined;
    } else {
      // check receipt
      pendingTxs
        .filter(
          (tx) => !doneTxHashes.some((doneTxHash) => doneTxHash === tx.hash)
        )
        .forEach((tx) => {
          // exclusive control
          if (doingTxHashes.some((doingTxHash) => doingTxHash === tx.hash))
            return;
          doingTxHashes.push(tx.hash);

          library
            .getTransactionReceipt(tx.hash)
            .then((receipt) => {
              // exclusive control
              const idx = doingTxHashes.findIndex(
                (doingTxHash) => doingTxHash === tx.hash
              );
              doingTxHashes.splice(idx, 1);

              if (receipt) {
                setDoneTxHashes((state) => state.concat(tx.hash));
                dispatch(endTx({ hash: tx.hash }));

                const popupContent = getContent(tx, chainId);

                notification.success({
                  ...popupContent,
                  duration: 0,
                });
              }
            })
            .catch((error) => {
              console.error(`failed to check transaction hash: ${tx}`, error);
            });
        });
    }
  });

  return null;
}
