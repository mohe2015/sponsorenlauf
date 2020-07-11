import React from "react";
import logo from "./logo.svg";
import "./App.css";
import LoginForm from "./LoginForm";
import { ThemeProvider } from "@material-ui/core/styles";
import { createMuiTheme } from "@material-ui/core/styles";
import purple from "@material-ui/core/colors/purple";
import green from "@material-ui/core/colors/green";
import { CssBaseline } from "@material-ui/core";

const theme = createMuiTheme();

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <LoginForm />
    </ThemeProvider>
  );
}

export default App;
