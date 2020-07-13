import React from "react";
import "./App.css";
import LoginForm from "./LoginForm";
import { ThemeProvider } from "@material-ui/core/styles";
import { unstable_createMuiStrictModeTheme as createMuiTheme, } from "@material-ui/core/styles";
import { CssBaseline } from "@material-ui/core";
import { Route, Switch } from 'react-router-dom';
import StartPage from "./StartPage";
import UserList from "./users/UserList";
import UserListRenderer from "./users/UserListRenderer";

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
          <StartPage />
          <Route path="/users">
            <UserListRenderer />
          </Route>
        </Route>
      </Switch>
    </ThemeProvider>
  );
}

export default App;
