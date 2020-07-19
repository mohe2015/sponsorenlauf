// your-app-name/src/RelayEnvironment.js
import { Environment, Network, QueryResponseCache, RecordSource, Store } from 'relay-runtime';

const oneMinute = 60 * 1000;
const cache = new QueryResponseCache({ size: 2500, ttl: 100 * oneMinute });
const store = new Store(new RecordSource());

function fetchQuery(
  operation,
  variables,
  cacheConfig,
) {
  const queryID = operation.text;
  const isMutation = operation.operationKind === 'mutation';
  const isQuery = operation.operationKind === 'query';
  const forceFetch = cacheConfig && cacheConfig.force;

  if (
    isQuery &&
    !forceFetch
  ) {
    let fromCache = cache.get(queryID, variables);
    if (fromCache !== null) {
      return fromCache;
    }
  }

  // Otherwise, fetch data from server
  return fetch('http://localhost:4000/graphql', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: "include",
    body: JSON.stringify({
      query: operation.text,
      variables,
    }),
  }).then(response => {
    return response.json();
  }).then(json => {
    // Update cache on queries
    if (isQuery && json) {
      cache.set(queryID, variables, json);
    }

    setTimeout(() => {

      console.log(store);
      let hashMap = store._recordSource._records
      console.log(Array.from(hashMap.keys()))
    }, 100)

    return json;
  });
}

const environment = new Environment({
  network: Network.create(fetchQuery),
  store,
});

export default environment;
