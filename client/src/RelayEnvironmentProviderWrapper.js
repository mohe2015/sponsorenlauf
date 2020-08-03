import React from 'react';
import RelayModernEnvironment from 'relay-runtime/lib/store/RelayModernEnvironment';

export const AuthContext = React.createContext({
  relayEnvironment: null,
  user: null,
  resetEnvironment: () => {

  }
});

function RelayEnvironmentWrapper({ children }) {
  const {
    state: { relay },
  } = useAuthContext();
  return (
    <RelayEnvironmentProvider environment={relay}>
       {children}
    </RelayEnvironmentProvider>
  );
}