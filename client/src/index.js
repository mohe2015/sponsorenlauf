import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import { RelayEnvironmentProvider } from 'react-relay/hooks';
import RelayEnvironment from './RelayEnvironment'
import { BrowserRouter as Router } from "react-router-dom";

ReactDOM.unstable_createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RelayEnvironmentProvider environment={RelayEnvironment}>
        <Router>
          <App />
        </Router>
    </RelayEnvironmentProvider>
  </React.StrictMode>
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
