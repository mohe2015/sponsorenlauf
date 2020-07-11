import { Environment, Network, RecordSource, Store } from "relay-runtime";
import { SubscriptionClient } from "subscriptions-transport-ws";
import { execute } from "apollo-link";
import { WebSocketLink } from "apollo-link-ws";

export const GC_USER_ID = "graphcool-user-id";
export const GC_AUTH_TOKEN = "graphcool-auth-token";

function fetchQuery(operation, variables) {
  let headers = {
    "Content-Type": "application/json"
  };
  if (localStorage.getItem(GC_AUTH_TOKEN)) {
    headers.Authorization = `Bearer ${localStorage.getItem(GC_AUTH_TOKEN)}`;
  }
  return fetch("http://localhost:4000", {
    method: "POST",
    headers,
    body: JSON.stringify({
      query: operation.text,
      variables
    })
  })
    .then(response => response.json())
    .then(result => {
      if (result && result.errors) {
        return { data: null, errors: result.errors };
      }
      return result;
    });
}

// https://theindustrialresolution.com/passion/graphql-relay-subscriptions
const subscriptionClient = new SubscriptionClient(
  "ws://localhost:4000/graphql",
  {
    connectionParams: {
      Authorization: `Bearer ${localStorage.getItem(GC_AUTH_TOKEN)}`
    },
    reconnect: true
  }
);

const subscriptionLink = new WebSocketLink(subscriptionClient);

// Prepare network layer from apollo-link for graphql subscriptions
const networkSubscriptions = (operation, variables) =>
  execute(subscriptionLink, {
    query: operation.text,
    variables
  });

const environment = new Environment({
  network: Network.create(fetchQuery, networkSubscriptions),
  store: new Store(new RecordSource())
});

export default environment;
