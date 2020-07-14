import React from "react";
import LoginForm from "./login/LoginForm";
import { ThemeProvider } from "@material-ui/core/styles";
import { unstable_createMuiStrictModeTheme as createMuiTheme, } from "@material-ui/core/styles";
import CssBaseline from "@material-ui/core/CssBaseline";
import { Route, Switch } from 'react-router-dom';
import UserListRenderer from "./users/UserListRenderer";
import MyAppBar from "./index/MyAppBar";

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
        </Route>
      </Switch>
    </ThemeProvider>
  );
}

export default App;
