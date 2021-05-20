import { createWeb3ReactRoot, Web3ReactProvider } from '@web3-react/core';
import React from 'react';
import ReactDOM from 'react-dom';
import './globals.css';
import { Provider } from 'react-redux';
import { HashRouter } from 'react-router-dom';
import App from './App';
import { NETWORK_CONTEXT_NAME } from './constants/web3';
import { getLibrary } from './hooks/useWeb3';
import store from './state';
import ThemeProvider from './theme';

const Web3ProviderNetwork = createWeb3ReactRoot(NETWORK_CONTEXT_NAME);

const { ethereum } = window;
if (!!ethereum) {
  ethereum.autoRefreshOnNetworkChange = false;
}

ReactDOM.render(
  <React.StrictMode>
    <Web3ReactProvider getLibrary={getLibrary}>
      <Web3ProviderNetwork getLibrary={getLibrary}>
        <Provider store={store}>
          <ThemeProvider>
            <HashRouter>
              <App />
            </HashRouter>
          </ThemeProvider>
        </Provider>
      </Web3ProviderNetwork>
    </Web3ReactProvider>
  </React.StrictMode>,
  document.getElementById('root')
);
