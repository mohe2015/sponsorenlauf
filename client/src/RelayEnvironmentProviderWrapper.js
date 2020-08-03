import React, { useContext } from 'react';
import RelayModernEnvironment from 'relay-runtime/lib/store/RelayModernEnvironment';

export const AuthContext = React.createContext({
  relayEnvironment: null,
  user: null,
  resetEnvironment: () => {

  }
});

export const useAuthContext = () => {
  const [relayEnvironment, setRelayEnvironment] = React.useState(null);

  const resetEnvironment = React.useCallback(() => {
    setRelayEnvironment(null);
  }, [])

  return {
    relayEnvironment,
    user: null,
    resetEnvironment
  }
}

function RelayEnvironmentWrapper({ children }) {
  const {
    state: { relayEnvironment },
  } = useAuthContext(AuthContext);
  return (
    <RelayEnvironmentProvider environment={relayEnvironment}>
       {children}
    </RelayEnvironmentProvider>
  );
}