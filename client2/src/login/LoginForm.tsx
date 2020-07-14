import React from "react";
import Avatar from "@material-ui/core/Avatar";
import CssBaseline from "@material-ui/core/CssBaseline";
import TextField from "@material-ui/core/TextField";
import Link from "@material-ui/core/Link";
import Grid from "@material-ui/core/Grid";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import Typography from "@material-ui/core/Typography";
import { Theme } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import { withStyles } from "@material-ui/core/styles";
import { Styles } from "@material-ui/core/styles/withStyles";
import LoadingButton from "@material-ui/lab/LoadingButton";
import { commitMutation } from "react-relay";
import environment from "../Environment";
import { graphql } from "babel-plugin-relay/macro";
import { PayloadError } from "relay-runtime";
import {
  Redirect
} from "react-router-dom";

type Props = {
  classes: any;
};

type State = {
  username: string;
  password: string;
  loading: boolean;
  loggedIn: boolean;
  errors: PayloadError[];
};

const styles: Styles<Theme, object> = (theme: Theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: "100%", // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
});

const mutation = graphql`
  mutation LoginFormMutation($username: String!, $password: String!) {
    login(name: $username, password: $password) {
      token
      user {
        id
      }
    }
  }
`;

class LoginForm extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      username: "",
      password: "",
      loading: false,
      errors: [],
      loggedIn: false,
    };
  }

  handleUsernameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ username: event.target.value });
  };

  handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ password: event.target.value });
  };

  handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    this.setState({ loading: true });

    const variables = {
      username: this.state.username,
      password: this.state.password,
    };

    commitMutation(environment, {
      mutation,
      variables,
      onCompleted: (response, errors) => {
        console.log("onCompleted")
        if (errors) {
          // @ts-expect-error
          this.setState({ loading: false, errors: errors });
        } else {
          this.setState({ loading: false, errors: [], loggedIn: true });
        }
      },
      onError: (err) => {
        console.log("onError")
        console.log(err)
        let unknownError = [{
          message: "Ein unbekannter Fehler ist aufgetreten: " + err.message,
          locations: null,
          severity: "CRITICAL",
        }];
        // @ts-expect-error
        this.setState({ loading: false, errors: err.res?.errors || unknownError});
      },
    });
  };

  render() {
    const { classes } = this.props;
    if (this.state.loggedIn) {
      return (<Redirect to="/" />)
    }
    return (
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <div className={classes.paper}>
          <Avatar className={classes.avatar}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Anmelden
          </Typography>
          <form
            className={classes.form}
            //noValidate
            onSubmit={this.handleSubmit}
          >
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="username"
              label="Benutzername"
              name="username"
              autoComplete="current-username"
              autoFocus
              value={this.state.username}
              onChange={this.handleUsernameChange}
              error={this.state.errors.length > 0}
              helperText={this.state.errors.map(e => e.message).reduce((a, b) => a + "\n" + b, "")}
            />
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              name="password"
              label="Passwort"
              type="password"
              id="password"
              autoComplete="current-password"
              value={this.state.password}
              onChange={this.handlePasswordChange}
              error={this.state.errors.length > 0}
              helperText={this.state.errors.map(e => e.message).reduce((a, b) => a + "\n" + b, "")}
            />
            <LoadingButton
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              className={classes.submit}
              pending={this.state.loading}
            >
              Anmelden
            </LoadingButton>
            <Grid container>
              <Grid item xs>
                <Link
                  href="mailto:Moritz.Hedtke@t-online.de?subject=Ich habe mein Passwort vergessen&body=Mein Benutzername ist: "
                  variant="body2"
                >
                  Passwort vergessen?
                </Link>
              </Grid>
            </Grid>
          </form>
        </div>
      </Container>
    );
  }
}

export default withStyles(styles)(LoginForm);
