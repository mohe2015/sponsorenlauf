import {
  Environment,
  Network,
  RecordSource,
  Store,
} from 'relay-runtime';
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
  }).then(response => {
    return response.json();
  });
}

const environment = new Environment({
  network: Network.create(fetchQuery),
  store: new Store(new RecordSource()),  
});

export default environment;

