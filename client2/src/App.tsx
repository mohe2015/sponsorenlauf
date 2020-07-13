import React from "react";
import "./App.css";
import LoginForm from "./LoginForm";
import { ThemeProvider } from "@material-ui/core/styles";
import { unstable_createMuiStrictModeTheme as createMuiTheme, } from "@material-ui/core/styles";
import { CssBaseline } from "@material-ui/core";
import { Route, Switch } from 'react-router-dom';
import StartPage from "./StartPage";

const theme = createMuiTheme({
  palette: {
    type: "dark",
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <div>a</div>
      <Switch>
        <Route path="/">
          <div>b</div>
          <StartPage />
        </Route>
        <Route path="login">
          <div>c</div>
          <LoginForm />
        </Route>
        <Route path="*">
          <div>d</div>
        </Route>
      </Switch>
    </ThemeProvider>
  );
}

export default App;
