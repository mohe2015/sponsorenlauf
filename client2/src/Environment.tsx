import {
  Environment,
  Network,
  RecordSource,
  Store,
  RequestParameters,
  Variables,
  GraphQLResponse,
  ObservableFromValue,
} from 'relay-runtime';

// Define a function that fetches the results of an operation (query/mutation/etc)
// and returns its results as a Promise:
function fetchQuery(
  request: RequestParameters,
  variables: Variables,
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
  })
  // this is a hack because relay is stupid
  .then((result) => {
    if (result && result.errors) {
      throw new Error(result.errors.map((e: any) => e.message));
      //return { data: null, errors: result.errors };
    }
    return result;
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