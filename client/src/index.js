import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import { RelayEnvironmentProvider } from 'react-relay/hooks';
import { BrowserRouter as Router } from "react-router-dom";
import { ConfirmProvider } from 'material-ui-confirm';
import { AuthContext } from './RelayEnvironmentProviderWrapper'

ReactDOM.unstable_createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthContext.Provider>
      <ConfirmProvider>
        <Router>
          <App />
        </Router>
      </ConfirmProvider>
    </AuthContext.Provider>
  </React.StrictMode>
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
