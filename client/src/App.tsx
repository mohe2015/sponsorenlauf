import React from "react";
import "./App.css";
import { Login } from "./login/Login";
import { Home } from "./Home";
import { MyAppBar } from "./MyAppBar";
import { UsersList } from "./users/UsersList";
import { RunnersList } from "./runners/RunnersList";
import { RoundsList } from "./rounds/RoundsList";
import { UserRoundsList } from "./user-rounds/UserRoundsList";
import CssBaseline from "@material-ui/core/CssBaseline";
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import { Routes, Route, useLocationPending } from "react-router-dom";
import { CreateUserContainer } from "./users/create/CreateUser";
import { CreateRunnerContainer } from "./runners/create/CreateRunner";
import { NotFound } from "./NotFound";
import { ProtectedRoute } from "./ProtectedRoute";
import {
  AuthContext,
  useAuthContext,
} from "./AuthContext";
import Snackbar from "@material-ui/core/Snackbar";
import { ClassRunnersList } from "./runners-by-class/ClassRunnersList";
import { Countdown } from "./countdown/Countdown";
import { ConfirmProvider } from "material-ui-confirm";
import { RelayEnvironmentProvider } from "react-relay/hooks";
import { BrowserRouter as Router } from "react-router-dom";
import { AuthorizationErrorBoundary } from "./AuthorizationErrorBoundary";

// authorizationerrorboundary
// which passes state update function down to login children
// login can then update the error state

function App() {
  let auth = useAuthContext();
  let pendingLocation = useLocationPending();

  const theme = React.useMemo(
      () =>
        createMuiTheme({
          palette: {
            
          },
        }),
      [],
    );

  return (
<React.StrictMode>
  <Router>
    <AuthContext.Provider value={auth}>
      <RelayEnvironmentProvider environment={auth.relay.environment}>
        <ThemeProvider theme={theme}>
          <ConfirmProvider>
            <CssBaseline />

            <Snackbar
              anchorOrigin={{ vertical: "top", horizontal: "center" }}
              open={pendingLocation}
              message="Wird geladen..."
            />

            <Routes>
              <ProtectedRoute path="*" element={<AuthorizationErrorBoundary><MyAppBar /></AuthorizationErrorBoundary>}>
                <Route path="/" element={<Home />} />
                <Route path="/users">
                  <Route path="/create" element={<CreateUserContainer />} />
                  <Route path="/edit/:id" element={<CreateUserContainer />} />
                  <Route path="*" element={<UsersList />} />
                </Route>
                <Route path="/runners">
                  <Route path="/create" element={<CreateRunnerContainer />} />
                  <Route path="/edit/:id" element={<CreateRunnerContainer />} />
                  <Route path="*" element={<RunnersList />} />
                </Route>
                <Route path="/countdown" element={<Countdown />} />
                <Route path="/by-class-runners" element={<ClassRunnersList />} />
                <Route path="/rounds">
                  <Route path="*" element={<RoundsList />} />
                </Route>
                <Route path="/user-rounds">
                  <Route path="*" element={<UserRoundsList />} />
                </Route>
                <Route path="*" element={<NotFound />} />
              </ProtectedRoute>
              <Route path="/login" element={<Login />} />
            </Routes>
            </ConfirmProvider>
        </ThemeProvider>
      </RelayEnvironmentProvider>
    </AuthContext.Provider>
    </Router>
  </React.StrictMode>
  );
}

export default App;
