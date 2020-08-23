import React, { useContext } from 'react';
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
import { useNavigate, useLocation, useParams } from "react-router-dom";
import { useLazyLoadQuery } from 'react-relay/hooks';
import { LoadingContext } from '../../LoadingContext'
import { CreateRunnerFindRunnerQuery } from '../../__generated__/CreateRunnerFindRunnerQuery.graphql';
import { CreateRunnerUpdateMutation } from '../../__generated__/CreateRunnerUpdateMutation.graphql';
import { LocationStateType } from '../../utils';
import { Location } from 'history';
import { CreateRunnerMutationResponse, CreateRunnerMutation } from '../../__generated__/CreateRunnerMutation.graphql';
import { ConnectionHandler, RecordSourceSelectorProxy, SelectorStoreUpdater } from 'relay-runtime';
import { UseMutationConfig } from 'react-relay/lib/relay-experimental/useMutation';

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

export function CreateRunnerContainer() {
  const loading = useContext(LoadingContext)

  if (loading) {
    return <div>Wird geladen...</div>
  } else {
    return <CreateRunner />
  }
}

export function CreateRunner() {
  const classes = useStyles();
  const navigate = useNavigate();
  const location = useLocation() as Location<LocationStateType | null>;
  let { id } = useParams();

  const data = useLazyLoadQuery<CreateRunnerFindRunnerQuery>(
    graphql`
  query CreateRunnerFindRunnerQuery($id: String) {
    runner(where: { id: $id }) {
      id
      startNumber
      name
      clazz
      grade
    }
  }
    `,
    {id},
    {
      fetchPolicy: "store-or-network",
      networkCacheConfig: {
        force: false
      },
      // @ts-expect-error
      skip: id === null,
    })

  const [runner_create, IsCreateRunnerPending] = useMutation<CreateRunnerMutation>(graphql`
  mutation CreateRunnerMutation($name: String!, $clazz: String!, $grade: Int!) {
    createOneRunner(data: { name: $name, clazz: $clazz, grade: $grade }) {
      __typename
      ... on RunnerMutationOutput {
        previous_edge
        edge {
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
      ... on RunnerMutationError {
        nameError
        gradeError
      }
    }
  }
  `);

  const [updateRunner, isUpdateRunnerPending] = useMutation<CreateRunnerUpdateMutation>(graphql`
  mutation CreateRunnerUpdateMutation($id: String, $name: String!, $clazz: String!, $grade: Int!) {
    updateOneRunner(where: { id: $id }, data: { name: $name, clazz: $clazz, grade: $grade }) {
      __typename
      ... on RunnerMutationOutput {
        previous_edge
        edge {
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
      ... on RunnerMutationError {
        nameError
        gradeError
      }
    }
  }
  `);

  const [name, setName] = useState(id ? data.runner?.name : '');
  const [clazz, setClazz] = useState(id ? data.runner?.clazz : '');
  const [grade, setGrade] = useState(id ? data.runner?.grade : 0);

  const [nameError, setNameError] = useState<string|null>(null);
  const [clazzError] = useState<string|null>(null);
  const [gradeError, setGradeError] = useState<string|null>(null);

  const [startTransition, isPending] = useTransition({ timeoutMs: 3000 });

  const onSubmit = useCallback(
    event => {
      event.preventDefault();

      if (id) {
        updateRunner({
          onCompleted: (response, errors) => {
            if (errors !== null) {
              console.log(errors)
              alert("Fehler: " + errors.map(e => e.message).join(", "))
            } else {
              if (response.updateOneRunner.__typename === "RunnerMutationError") {
                setNameError(response.updateOneRunner.nameError);
                setGradeError(response.updateOneRunner.gradeError);
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
            }
          },
          onError: error => {
            console.log(error);
            alert(error); // TODO FIXME
          },
          variables: {
            id,
            name: name!,
            clazz: clazz!,
            grade: grade!
          },
        })
      } else {
        let config: UseMutationConfig<CreateRunnerMutation> = {
          onCompleted: (response, errors) => {
            if (errors !== null) {
              console.log(errors)
              alert("Fehler: " + errors.map(e => e.message).join(", "))
            } else {
              if (response.createOneRunner.__typename === "RunnerMutationError") {
                setNameError(response.createOneRunner.nameError);
                setGradeError(response.createOneRunner.gradeError);
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
            }
          },
          onError: error => {
            console.log(error);
            alert(error); // TODO FIXME
          },
          variables: {
            name: name!,
            clazz: clazz!,
            grade: grade!
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
            const payload = store.getRootField("createOneRunner");

            switch (payload.getValue("__typename")) {
              case "RunnerMutationOutput": {
                const previousEdge = payload.getLinkedRecord('previous_edge');
                const serverEdge = payload.getLinkedRecord('edge');
    
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
              case "RunnerMutationError": {
                
              }
              default: {

              }
            }
          }
        };
        runner_create(config);
      }
    },
    [id, updateRunner, name, clazz, grade, runner_create, navigate, startTransition, location]
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
            pending={IsCreateRunnerPending || isUpdateRunnerPending || isPending}
          >
            Läufer {id ? "bearbeiten" : "hinzufügen"}
          </LoadingButton>
        </form>
      </div>
    </Container>
    )
}