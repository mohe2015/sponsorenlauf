// your-app-name/src/RelayEnvironment.js
import { Environment, Network, QueryResponseCache, RecordSource, Store } from 'relay-runtime';
import { SubscriptionClient } from "subscriptions-transport-ws";
import { execute } from "@apollo/client";
import { WebSocketLink } from "@apollo/client/link/ws";

const oneMinute = 60 * 1000;
const cache = new QueryResponseCache({ size: 2500, ttl: 100 * oneMinute });
const store = new Store(new RecordSource(), {gcReleaseBufferSize: 100});

function fetchQuery(
  operation,
  variables,
  cacheConfig,
) {
  const queryID = operation.text;
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

      //console.log(store);
      let hashMap = store._recordSource._records
      console.log(Array.from(hashMap.entries()))
    }, 100)

    return json;
  });
}


// https://theindustrialresolution.com/passion/graphql-relay-subscriptions
const subscriptionClient = new SubscriptionClient(
  "ws://localhost:4000/graphql",
  {
   // credentials: "include",
    reconnect: true,
  }
);

const subscriptionLink = new WebSocketLink(subscriptionClient);

// Prepare network layer from apollo-link for graphql subscriptions
const networkSubscriptions = (operation, variables) => {
  console.log(operation);
  console.log(variables);
  execute(subscriptionLink, {
    query: operation.text,
    variables,
  })
};

const environment = new Environment({
  network: Network.create(fetchQuery, networkSubscriptions),
  store,
});

export default environment;
