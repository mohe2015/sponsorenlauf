import {
  Environment,
  Network,
  RecordSource,
  Store,
  RequestParameters,
  Variables,
  CacheConfig,
  UploadableMap,
  GraphQLResponse,
  ObservableFromValue,
  Disposable,
} from 'relay-runtime';
import { LegacyObserver } from 'relay-runtime/lib/network/RelayNetworkTypes';
import { RelayObservable } from 'relay-runtime/lib/network/RelayObservable';

// Define a function that fetches the results of an operation (query/mutation/etc)
// and returns its results as a Promise:
function fetchQuery(
  request: RequestParameters,
  variables: Variables,
  cacheConfig: CacheConfig,
  uploadables?: UploadableMap | null,
): ObservableFromValue<GraphQLResponse> {
  return fetch('http://localhost:4000/graphql', {
    method: 'POST',
    headers: {
      'content-type': 'application/json'
    },
    credentials: "include",
    body: JSON.stringify({
      query: request.text, // GraphQL text from input
      variables,
    }),
  }).then(response => {
    return response.json();
  });
}
/*
function fetchSubscribe(
  request: RequestParameters,
  variables: Variables,
  cacheConfig: CacheConfig,
  observer?: LegacyObserver<GraphQLResponse>,
): RelayObservable<GraphQLResponse> | Disposable {
  
}
*/
// Create a network layer from the fetch function
const network = Network.create(fetchQuery);
const source = new RecordSource();
const store = new Store(source);

const environment = new Environment({
  network,
  store,
});


export default environment;