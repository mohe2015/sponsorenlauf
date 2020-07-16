import React from "react";
import LoginForm from "./login/LoginForm";
import { ThemeProvider } from "@material-ui/core/styles";
import { unstable_createMuiStrictModeTheme as createMuiTheme, } from "@material-ui/core/styles";
import CssBaseline from "@material-ui/core/CssBaseline";
import { Route, Switch } from 'react-router-dom';
import UserListRenderer from "./users/UserListRenderer";
import MyAppBar from "./index/MyAppBar";
import RunnerListRenderer from "./runners/RunnerListRenderer";
import "./index.css";
import PaginatedRunnerList from "./runners/PaginatedRunnerList";
import PaginatedRunnerListRenderer from "./runners/PaginatedRunnerListRenderer";
import TestPaginatedRunnerListRenderer from "./runners/TestPaginatedRunnerListRenderer";

const theme = createMuiTheme({
  palette: {
    type: "dark",
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Switch>
        <Route path="/login">
          <LoginForm />
        </Route>
        <Route path="/">
          <MyAppBar />
          <Route path="/users">
            <UserListRenderer />
          </Route>
          <Route path="/runners">
            <RunnerListRenderer />
          </Route>
          <Route path="/paginated-runners">
            <PaginatedRunnerListRenderer />
          </Route>
          <Route path="/test-paginated-runners">
            <TestPaginatedRunnerListRenderer />
          </Route>
        </Route>
      </Switch>
    </ThemeProvider>
  );
}

export default App;
