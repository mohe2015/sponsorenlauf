import React from 'react';
import { useMutation } from 'react-relay/hooks';
import graphql from "babel-plugin-relay/macro";
import { useState, useCallback, unstable_useTransition as useTransition } from 'react';
import Avatar from '@material-ui/core/Avatar';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus } from '@fortawesome/free-solid-svg-icons'
import LoadingButton from '@material-ui/lab/LoadingButton';
import Alert from '@material-ui/lab/Alert';
import { useNavigate, useLocation } from "react-router-dom";
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import { ConnectionHandler } from 'react-relay';

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

export function CreateUser(props) {
  const classes = useStyles();
  const navigate = useNavigate();
  const location = useLocation();

  const [user_create, isCreateOneUserPending] = useMutation(graphql`
  mutation CreateUserMutation($username: String!, $role: UserRole!) {
    user_create(data: { name: $username, role: $role }) {
      __typename
      ... on CreateUserMutationOutput {
        user_edge {
          cursor
          node {
            id
            name
            role
          }
        }
      }
      ... on CreateOneUserMutationError {
        usernameError
        roleError
      }
    }
  }
  `);

  const [username, setUsername] = useState('');
  const [role, setRole] = useState('');

  const [usernameError, setUsernameError] = useState(null);
  const [roleError, setRoleError] = useState(null);

  const [startTransition, isPending] = useTransition({ timeoutMs: 3000 });

  const onSubmit = useCallback(
    event => {
      event.preventDefault();

      user_create({
        onCompleted: response => {
          if (response.user_create.__typename === "CreateUserMutationError") {
            setUsernameError(response.user_create.usernameError);
            setRoleError(response.user_create.roleError);
          } else {
            setUsernameError(null);
            setRoleError(null);

            startTransition(() => {
              if (location.state?.oldPathname) {
                navigate(location.state?.oldPathname);
              } else {
                navigate("/users");
              }
            });
          }
        },
        onError: error => {
          console.log(error);
          alert(error); // TODO FIXME
        },
        variables: {
          username,
          role
        },
        updater: (store) => {
          //console.log(store)
          //console.log(store.__recordSource._proxies)

          //console.log(store.getRoot());
          //console.log(ConnectionHandler);
          // TODO FIXME error response
          const connectionRecord = ConnectionHandler.getConnection(
            store.getRoot(),
            "UsersList_user_users"
          );
          if (!connectionRecord) {
            return;
          }
          const payload = store.getRootField("user_create");

          const previousEdge = payload.getLinkedRecord('previous_edge');
          const serverEdge = payload.getLinkedRecord('user_edge');

          //console.log(connectionRecord);
          //console.log(newUserRecord);

          const newEdge = ConnectionHandler.buildConnectionEdge(
            store,
            connectionRecord,
            serverEdge,
          );

          ConnectionHandler.insertEdgeAfter(
            connectionRecord,
            newEdge,
            previousEdge
          );
        }
      })
    },
    [username, role, user_create, navigate, startTransition, location]
  );

    return (
      <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <FontAwesomeIcon icon={faPlus} />
        </Avatar>
        <Typography component="h1" variant="h5">
          Nutzer hinzufügen
        </Typography>

        <form className={classes.form} noValidate onSubmit={onSubmit}>
          {location.state?.errorMessage && <Alert variant="filled" severity="error">
            {location.state?.errorMessage}
          </Alert>}

          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="username"
            label="Nutzername"
            name="username"
            autoComplete="off"
            autoFocus
            value={username}
            onChange={e => setUsername(e.target.value)}
            helperText={usernameError}
            error={usernameError !== null}
          />
          <FormControl variant="outlined" fullWidth>
            <InputLabel id="demo-simple-select-label">Rolle</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={role}
              onChange={e => setRole(e.target.value)}
              >
              <MenuItem value={"ADMIN"}>Admin</MenuItem>
              <MenuItem value={"TEACHER"}>Rundenzähler</MenuItem>
              <MenuItem value={"VIEWER"}>Anzeiger</MenuItem>
            </Select>
          </FormControl>
          <LoadingButton
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
            pending={isCreateOneUserPending || isPending}
          >
            Nutzer hinzufügen
          </LoadingButton>
        </form>
      </div>
    </Container>
    )
}