import {
  split,
  HttpLink,
  ApolloClient,
  InMemoryCache,
  NormalizedCacheObject,
} from '@apollo/client';
import { WebSocketLink } from '@apollo/client/link/ws';
import { getMainDefinition } from '@apollo/client/utilities';
import {
  SUBGRAPH_HTTP_ENDPOINT,
  SUBGRAPH_WSS_ENDPOINT,
} from '../constants/api';

const enableGraph =
  process.env.REACT_APP_ENABLE_SUBGRAPH &&
  process.env.REACT_APP_ENABLE_SUBGRAPH.toLowerCase() === 'true';

let mainClient: ApolloClient<NormalizedCacheObject>;
if (enableGraph) {
  const httpLink = new HttpLink({
    uri: SUBGRAPH_HTTP_ENDPOINT,
  });
  const wsLink = new WebSocketLink({
    uri: SUBGRAPH_WSS_ENDPOINT,
    options: {
      reconnect: true,
    },
  });

  // The split function takes three parameters:
  //
  // * A function that's called for each operation to execute
  // * The Link to use for an operation if the function returns a "truthy" value
  // * The Link to use for an operation if the function returns a "falsy" value
  const splitLink = split(
    ({ query }) => {
      const definition = getMainDefinition(query);
      return (
        definition.kind === 'OperationDefinition' &&
        definition.operation === 'subscription'
      );
    },
    wsLink,
    httpLink
  );

  mainClient = new ApolloClient({
    link: splitLink,
    cache: new InMemoryCache(),
    queryDeduplication: true,
    defaultOptions: {
      watchQuery: {
        fetchPolicy: 'network-only',
      },
      query: {
        fetchPolicy: 'network-only',
        errorPolicy: 'all',
      },
    },
  });
} else {
  // TODO: replace more effective no-op object.
  mainClient = new ApolloClient({ cache: new InMemoryCache() });
}

export const client = mainClient;
