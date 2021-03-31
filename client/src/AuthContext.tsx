import React, { useContext, ReactNode } from "react";
import { createEnvironment } from "./RelayEnvironment";
import { RelayEnvironmentProvider } from "react-relay/hooks";
import RelayModernEnvironment from "relay-runtime/lib/store/RelayModernEnvironment";
import RelayQueryResponseCache from "relay-runtime/lib/network/RelayQueryResponseCache";

type AuthContextProps = {
  relay: {
    cache: RelayQueryResponseCache;
    environment: RelayModernEnvironment;
  };
  user: null;
  resetEnvironment: () => void;
};

export const AuthContext = React.createContext<AuthContextProps>(undefined!);

export const useAuthContext = () => {
  const [relay, setRelay] = React.useState(createEnvironment());

  const resetEnvironment = React.useCallback(() => {
    console.log("resetEnvironment");
    setRelay(createEnvironment());
  }, []);

  return {
    relay,
    user: null,
    resetEnvironment,
  };
};