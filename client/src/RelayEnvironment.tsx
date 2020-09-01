import { Environment, Network, QueryResponseCache, RecordSource, Store, Observable, RequestParameters, Variables, CacheConfig, GraphQLResponse, Disposable, ObservableFromValue } from 'relay-runtime';
import { SubscriptionClient } from 'subscriptions-transport-ws'
import { RelayObservable } from 'relay-runtime/lib/network/RelayObservable';

function fetchQuery(cache: QueryResponseCache) {
  return (operation: RequestParameters, variables: Variables, cacheConfig: CacheConfig): ObservableFromValue<GraphQLResponse> => {
    const queryID = operation.text;
    const isMutation = operation.operationKind === 'mutation';
    const isQuery = operation.operationKind === 'query';
    const forceFetch = cacheConfig && cacheConfig.force;

    if (
      isQuery &&
      queryID &&
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
      if (isQuery && queryID && json) {
        cache.set(queryID, variables, json);
      }
      if (json.data === null && json.errors) {
        console.log("error, NEXT MESSAGE HAS TO BE NEW ENVIRONMENT");
      }
      if (isMutation && operation.name === "LoginMutation") {
        console.log("login, NEXT MESSAGE HAS TO BE NEW ENVIRONMENT");
      }

      return json;
    })
  }
}

const subscriptionClient = new SubscriptionClient('ws://localhost:4000/graphql', {
    reconnect: true,
});

const subscribe = (request: RequestParameters, variables: Variables): RelayObservable<GraphQLResponse> | Disposable => {
    const subscribeObservable = subscriptionClient.request({
        query: request.text === null ? undefined : request.text,
        operationName: request.name,
        variables,
    });
    // Important: Convert subscriptions-transport-ws observable type to Relay's
    // @ts-expect-error
    return Observable.from(subscribeObservable);
};

export const createEnvironment = () => {
  let cache = new QueryResponseCache({ size: 2500, ttl: 60 * 1000 });
  return {
    cache,
    environment: new Environment({
      network: Network.create(fetchQuery(cache), subscribe),
      store: new Store(new RecordSource(), {gcReleaseBufferSize: 100}),
    }),
  }
}

