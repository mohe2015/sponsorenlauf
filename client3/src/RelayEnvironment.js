// your-app-name/src/RelayEnvironment.js
import { Environment, Network, RecordSource, Store } from 'relay-runtime';

async function fetchRelay(params, variables) {
  const response = await fetch('http://localhost:4000/graphql', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: "include",
    body: JSON.stringify({
      query: params.text,
      variables,
    }),
  });

  return await response.json();
}

export default new Environment({
  network: Network.create(fetchRelay),
  store: new Store(new RecordSource()),
});
