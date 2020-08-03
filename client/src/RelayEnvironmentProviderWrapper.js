import React, { useContext } from 'react';
import RelayModernEnvironment from 'relay-runtime/lib/store/RelayModernEnvironment';
import { createEnvironment } from './RelayEnvironment'
import { RelayEnvironmentProvider } from 'react-relay/hooks';

export const AuthContext = React.createContext(null);

export const useAuthContext = () => {
  const [relayEnvironment, setRelayEnvironment] = React.useState(createEnvironment());

  const resetEnvironment = React.useCallback(() => {
    setRelayEnvironment(createEnvironment());
  }, [])

  return {
    relayEnvironment,
    user: null,
    resetEnvironment
  }
}

export function RelayEnvironmentWrapper({ children }) {
  const {
    relayEnvironment
  } = useContext(AuthContext);
  return (
    <RelayEnvironmentProvider environment={relayEnvironment}>
       {children}
    </RelayEnvironmentProvider>
  );
}