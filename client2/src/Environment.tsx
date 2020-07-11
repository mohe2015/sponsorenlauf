import {
  Environment,
  Network,
  RecordSource,
  Store,
  RequestParameters,
  Variables,
  CacheConfig,
  UploadableMap,
  Disposable,
} from "relay-runtime";
import {
  LegacyObserver,
  GraphQLResponse,
} from "relay-runtime/lib/network/RelayNetworkTypes";
import {
  RelayObservable,
  ObservableFromValue,
} from "relay-runtime/lib/network/RelayObservable";
/*
function fetchQuery(
  operation: RequestParameters,
  variables: Variables,
  cacheConfig: CacheConfig,
  uploadables?: UploadableMap | null,
): ObservableFromValue<GraphQLResponse> {
  return fetch('/graphql', {
    method: 'POST',
    headers: {
      // Add authentication and other headers here
      'content-type': 'application/json'
    },
    body: JSON.stringify({
      query: operation.text, // GraphQL text from input
      variables,
    }),
  }).then(response => {
    return response.json();
  });
}

function subscribeQuery(request: RequestParameters,
  variables: Variables,
  cacheConfig: CacheConfig,
  observer?: LegacyObserver<GraphQLResponse>): RelayObservable<GraphQLResponse> | Disposable {
    
  }*/

// https://github.com/relay-tools/react-relay-network-modern

// Create a network layer from the fetch function
const network = Network.create(fetchQuery);

const source = new RecordSource();
const store: Store = new Store(source);
const handlerProvider = null;

const environment = new Environment({
  handlerProvider, // Can omit.
  network,
  store,
});

export default environment;
