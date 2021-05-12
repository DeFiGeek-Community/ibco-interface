import { createWeb3ReactRoot, Web3ReactProvider } from '@web3-react/core';
import React from 'react';
import ReactDOM from 'react-dom';
import './globals.css';
import { HashRouter } from 'react-router-dom';
import App from './App';
import { NETWORK_CONTEXT_NAME } from './constants/web3';
import { getLibrary } from './hooks/useWeb3';

const Web3ProviderNetwork = createWeb3ReactRoot(NETWORK_CONTEXT_NAME);

const { ethereum } = window as any;
if (!!ethereum) {
  ethereum.autoRefreshOnNetworkChange = false;
}

ReactDOM.render(
  <React.StrictMode>
    <Web3ReactProvider getLibrary={getLibrary}>
      <Web3ProviderNetwork getLibrary={getLibrary}>
        <HashRouter>
          <App />
        </HashRouter>
      </Web3ProviderNetwork>
    </Web3ReactProvider>
  </React.StrictMode>,
  document.getElementById('root')
);
