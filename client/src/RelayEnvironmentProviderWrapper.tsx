import React, { useContext } from 'react';
import { createEnvironment } from './RelayEnvironment'
import { RelayEnvironmentProvider } from 'react-relay/hooks';

export const AuthContext = React.createContext(null);

export const useAuthContext = () => {
  const [relay, setRelay] = React.useState(createEnvironment());

  const resetEnvironment = React.useCallback(() => {
    console.log("resetEnvironment")
    setRelay(createEnvironment());
  }, [])

  return {
    relay,
    user: null,
    resetEnvironment
  }
}

export function RelayEnvironmentWrapper({ children }) {
  const {
    relay
  } = useContext(AuthContext);
  return (
    <RelayEnvironmentProvider environment={relay.environment}>
       {children}
    </RelayEnvironmentProvider>
  );
}