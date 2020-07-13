import React from "react";
import logo from "./logo.svg";
import "./App.css";
import LoginForm from "./LoginForm";
import { ThemeProvider } from "@material-ui/core/styles";
import { unstable_createMuiStrictModeTheme as createMuiTheme, } from "@material-ui/core/styles";
import purple from "@material-ui/core/colors/purple";
import green from "@material-ui/core/colors/green";
import { CssBaseline } from "@material-ui/core";
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
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
      <Routes>
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
      </Routes>
    </ThemeProvider>
  );
}

export default App;
