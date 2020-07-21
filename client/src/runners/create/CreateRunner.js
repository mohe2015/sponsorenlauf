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

export function CreateRunner(props) {
  const classes = useStyles();
  const navigate = useNavigate();
  const location = useLocation();

  const [runner_create, IsCreateRunnerPending] = useMutation(graphql`
  mutation CreateRunnerMutation($name: String!, $clazz: String!, $grade: Int!) {
    runner_create(data: { name: $name, clazz: $clazz, grade: $grade }) {
      __typename
      ... on CreateRunnerMutationOutput {
        previous_edge
        runner_edge {
          cursor
          node {
            id
            startNumber
            name
            clazz
            grade
          }
        }
      }
      ... on CreateRunnerMutationError {
        usernameError
        roleError
      }
    }
  }
  `);

  const [name, setName] = useState('');
  const [clazz, setClazz] = useState('');
  const [grade, setGrade] = useState(0);

  const [nameError, setNameError] = useState(null);
  const [clazzError, setClazzError] = useState(null);
  const [gradeError, setGradeError] = useState(null);

  const [startTransition, isPending] = useTransition({ timeoutMs: 3000 });

  const onSubmit = useCallback(
    event => {
      event.preventDefault();

      runner_create({
        onCompleted: response => {
          if (response.runner_create.__typename === "CreateRunnerMutationError") {
            setNameError(response.runner_create.nameError);
            setGradeError(response.runner_create.gradeError);
          } else {
            setNameError(null);
            setGradeError(null);

            startTransition(() => {
              if (location.state?.oldPathname) {
                navigate(location.state?.oldPathname);
              } else {
                navigate("/runners");
              }
            });
          }
        },
        onError: error => {
          console.log(error);
          alert(error); // TODO FIXME
        },
        variables: {
          name,
          clazz,
          grade: parseInt(grade)
        },
        updater: (store) => {
          //console.log(store)
          //console.log(store.__recordSource._proxies)

          //console.log(store.getRoot());
          //console.log(ConnectionHandler);
          // TODO FIXME error response
          const connectionRecord = ConnectionHandler.getConnection(
            store.getRoot(),
            "RunnersList_runner_runners"
          );
          if (!connectionRecord) {
            return;
          }
          const payload = store.getRootField("runner_create");

          const previousEdge = payload.getLinkedRecord('previous_edge');
          const serverEdge = payload.getLinkedRecord('runner_edge');

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
    [name, clazz, grade, runner_create, navigate, startTransition, location]
  );

    return (
      <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <FontAwesomeIcon icon={faPlus} />
        </Avatar>
        <Typography component="h1" variant="h5">
          Läufer hinzufügen
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
            id="name"
            label="Name"
            name="name"
            autoComplete="off"
            autoFocus
            value={name}
            onChange={e => setName(e.target.value)}
            helperText={nameError}
            error={nameError !== null}
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="clazz"
            label="Klasse"
            name="clazz"
            autoComplete="off"
            autoFocus
            value={clazz}
            onChange={e => setClazz(e.target.value)}
            helperText={clazzError}
            error={clazzError !== null}
          />
          <TextField
            type="number"
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="grade"
            label="Jahrgang"
            name="grade"
            autoComplete="off"
            autoFocus
            value={grade}
            onChange={e => setGrade(e.target.value)}
            helperText={gradeError}
            error={gradeError !== null}
          />
          <LoadingButton
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
            pending={IsCreateRunnerPending || isPending}
          >
            Läufer hinzufügen
          </LoadingButton>
        </form>
      </div>
    </Container>
    )
}