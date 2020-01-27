import {
  Environment,
  Network,
  RecordSource,
  Store,
} from 'relay-runtime';
import { SubscriptionClient } from 'subscriptions-transport-ws'
import { GC_AUTH_TOKEN } from './constants';

function fetchQuery(
  operation,
  variables,
) {
  return fetch('http://localhost:4000', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem(GC_AUTH_TOKEN)}`
    },
    body: JSON.stringify({
      query: operation.text,
      variables,
    }),
  }).then(response => response.json())
  .then(result => {
    if (result && result.errors) {
      return {data: null, errors: result.errors};
    }
    return result
  });
}

const setupSubscription = (config, variables, cacheConfig, observer) => {
  const query = config.text

/*
// https://theindustrialresolution.com/passion/graphql-relay-subscriptions
const subscriptionClient = new SubscriptionClient('ws://localhost:4001/graphql', {
  reconnect: true
})

const subscriptionLink = new WebSocketLink(subscriptionClient)

// Prepare network layer from apollo-link for graphql subscriptions
const networkSubscriptions = (operation, variables) =>
  execute(subscriptionLink, {
    query: operation.text,
    variables
  })

*/

  const subscriptionClient = new SubscriptionClient('ws://localhost:4000', {reconnect: true})
  subscriptionClient.subscribe({query, variables}, (error, result) => {
    observer.onNext({data: result})
  })
}

const environment = new Environment({
  network: Network.create(fetchQuery, setupSubscription),
  store: new Store(new RecordSource()),  
});

export default environment;

