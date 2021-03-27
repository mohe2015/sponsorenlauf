import React, { useContext } from "react";
import { useMutation } from "react-relay/hooks";
import {
  useState,
  useCallback,
  unstable_useTransition as useTransition,
} from "react";
import Avatar from "@material-ui/core/Avatar";
import CssBaseline from "@material-ui/core/CssBaseline";
import TextField from "@material-ui/core/TextField";
import Link from "@material-ui/core/Link";
import Grid from "@material-ui/core/Grid";
import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLock } from "@fortawesome/free-solid-svg-icons/faLock";
import LoadingButton from "@material-ui/lab/LoadingButton";
import Alert from "@material-ui/lab/Alert";
import { useNavigate, useLocation } from "react-router-dom";
import { AuthContext } from "../RelayEnvironmentProviderWrapper";
import { LoginMutation } from "../__generated__/LoginMutation.graphql";
import { AuthorizationErrorBoundaryState } from "../AuthorizationErrorBoundary";
import { Location } from "history";
import { LocationStateType } from "../utils";
import graphql from 'babel-plugin-relay/macro';

function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {"Copyright © "}
      <Link color="inherit" href="https://github.com/mohe2015/sponsorenlauf/">
        Moritz Hedtke
      </Link>{" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}

const useStyles = makeStyles((theme) => ({
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
}));

interface LoginProps {
  updateErrorBoundary?: (
    fun: (
      previousState: AuthorizationErrorBoundaryState
    ) => AuthorizationErrorBoundaryState
  ) => any;
}

export function Login(props: LoginProps) {
  const { updateErrorBoundary } = props;

  const { resetEnvironment } = useContext(AuthContext);

  const classes = useStyles();
  const navigate = useNavigate();
  const location = useLocation() as Location<LocationStateType | null>;

  const [login, isLoginPending] = useMutation<LoginMutation>(graphql`
    mutation LoginMutation($username: String!, $password: String!) {
      login(name: $username, password: $password) {
        __typename
        ... on User {
          id
        }
        ... on LoginMutationError {
          usernameError
          passwordError
        }
      }
    }
  `);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [usernameError, setUsernameError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);

  const [startTransition, isPending] = useTransition({ busyDelayMs: 1000, busyMinDurationMs: 1500 });

  const onSubmit = useCallback(
    (event) => {
      event.preventDefault();

      login({
        onCompleted: (response, errors) => {
          if (errors !== null) {
            console.log(errors);
            alert("Fehler: " + errors.map((e) => e.message).join(", "));
          } else {
            if (response.login.__typename === "LoginMutationError") {
              setUsernameError(response.login.usernameError);
              setPasswordError(response.login.passwordError);
            } else {
              setUsernameError(null);
              setPasswordError(null);

              startTransition(() => {
                if (updateErrorBoundary) {
                  console.log("updateErrorBoundary");

                  resetEnvironment();

                  updateErrorBoundary(
                    (prevState: AuthorizationErrorBoundaryState) => {
                      return { error: null, id: prevState.id + 1 };
                    }
                  );
                } else {
                  if (location.state?.oldPathname) {
                    console.log("Redirecting to ", location.state?.oldPathname);
                    navigate(location.state?.oldPathname);
                  } else {
                    navigate("/");
                  }
                }
              });
            }
          }
        },
        onError: (error) => {
          alert(error); // TODO FIXME
        },
        variables: {
          username,
          password,
        },
      });
    },
    [
      resetEnvironment,
      username,
      password,
      login,
      navigate,
      startTransition,
      location,
      updateErrorBoundary,
    ]
  );

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <FontAwesomeIcon icon={faLock} />
        </Avatar>
        <Typography component="h1" variant="h5">
          Anmelden
        </Typography>

        <form className={classes.form} noValidate onSubmit={onSubmit}>
          {location.state?.errorMessage && (
            <Alert variant="filled" severity="error">
              {location.state?.errorMessage}
            </Alert>
          )}

          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="username"
            label="Nutzername"
            name="username"
            autoComplete="current-username"
            autoFocus
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            helperText={usernameError}
            error={usernameError !== null}
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
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            helperText={passwordError}
            error={passwordError !== null}
          />
          <LoadingButton
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
            pending={isLoginPending || isPending}
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
      <Box mt={8}>
        <Copyright />
      </Box>
    </Container>
  );
}
