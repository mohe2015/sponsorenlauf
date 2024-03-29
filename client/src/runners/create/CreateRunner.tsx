import React, { useContext } from "react";
import { useMutation } from "react-relay/hooks";
import { useState, useCallback, useTransition } from "react";
import Avatar from "@mui/material/Avatar";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons/faPlus";
import LoadingButton from "@mui/lab/LoadingButton";
import Alert from "@mui/material/Alert";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import { useLazyLoadQuery } from "react-relay/hooks";
import { LoadingContext } from "../../LoadingContext";
import { CreateRunnerFindRunnerQuery } from "../../__generated__/CreateRunnerFindRunnerQuery.graphql";
import { CreateRunnerUpdateMutation } from "../../__generated__/CreateRunnerUpdateMutation.graphql";
import { LocationStateType } from "../../utils";
import { Location } from "history";
import { CreateRunnerMutation } from "../../__generated__/CreateRunnerMutation.graphql";
import { ConnectionHandler } from "relay-runtime";
import { UseMutationConfig } from "react-relay";
import graphql from "babel-plugin-relay/macro";
import { makeStyles } from "@mui/styles";
import { Theme } from "@mui/material";

const useStyles = makeStyles((theme: Theme) => ({
  paper: {
    marginTop: "8px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  avatar: {
    margin: "1px",
    //backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: "100%", // Fix IE 11 issue.
    marginTop: "1px",
  },
  submit: {
    margin: "3px 0px 2px",
  },
}));

export function CreateRunnerContainer() {
  const loading = useContext(LoadingContext);

  if (loading) {
    return <div>Wird geladen...</div>;
  } else {
    return <CreateRunner />;
  }
}

export function CreateRunner() {
  const classes = useStyles();
  const navigate = useNavigate();
  const location = useLocation() as Location<LocationStateType | null>;
  let { id } = useParams();

  const data = useLazyLoadQuery<CreateRunnerFindRunnerQuery>(
    graphql`
      query CreateRunnerFindRunnerQuery($id: ID!) {
        runner(where: { id: $id }) {
          id
          startNumber
          name
          clazz
          grade
        }
      }
    `,
    { id },
    {
      fetchPolicy: "store-or-network",
      networkCacheConfig: {
        force: false,
      },
      // @ts-expect-error
      skip: id === null,
    }
  );

  const [runner_create, IsCreateRunnerPending] =
    useMutation<CreateRunnerMutation>(graphql`
      mutation CreateRunnerMutation(
        $name: String!
        $clazz: String!
        $grade: Int!
      ) {
        createOneRunner(data: { name: $name, clazz: $clazz, grade: $grade }) {
          __typename
          ... on RunnerMutationOutput {
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

  const [updateRunner, isUpdateRunnerPending] =
    useMutation<CreateRunnerUpdateMutation>(graphql`
      mutation CreateRunnerUpdateMutation(
        $id: ID!
        $name: String!
        $clazz: String!
        $grade: Int!
      ) {
        updateOneRunner(
          where: { id: $id }
          data: { name: $name, clazz: $clazz, grade: $grade }
        ) {
          __typename
          ... on RunnerMutationOutput {
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

  const [name, setName] = useState(id ? data.runner?.name : "");
  const [clazz, setClazz] = useState(id ? data.runner?.clazz : "");
  const [grade, setGrade] = useState(id ? data.runner?.grade : 0);

  const [nameError, setNameError] = useState<string | null>(null);
  const [clazzError] = useState<string | null>(null);
  const [gradeError, setGradeError] = useState<string | null>(null);

  const [isPending, startTransition] = useTransition();

  const onSubmit = useCallback(
    (event) => {
      event.preventDefault();

      if (id) {
        updateRunner({
          onCompleted: (response, errors) => {
            if (errors !== null) {
              console.log(errors);
              alert("Fehler: " + errors.map((e) => e.message).join(", "));
            } else {
              if (
                response.updateOneRunner.__typename === "RunnerMutationError"
              ) {
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
          onError: (error) => {
            console.log(error);
            alert(error); // TODO FIXME
          },
          variables: {
            id,
            name: name!,
            clazz: clazz!,
            grade: grade!,
          },
        });
      } else {
        let config: UseMutationConfig<CreateRunnerMutation> = {
          onCompleted: (response, errors) => {
            if (errors !== null) {
              console.log(errors);
              alert("Fehler: " + errors.map((e) => e.message).join(", "));
            } else {
              if (
                response.createOneRunner.__typename === "RunnerMutationError"
              ) {
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
          onError: (error) => {
            console.log(error);
            alert(error); // TODO FIXME
          },
          variables: {
            name: name!,
            clazz: clazz!,
            grade: grade!,
          },
          updater: (store) => {
            const connectionRecord = ConnectionHandler.getConnection(
              store.getRoot(),
              "RunnersList_runner_runners"
            );
            if (!connectionRecord) {
              return;
            }
            const payload = store.getRootField("createOneRunner");

            if (payload.getValue("__typename") === "RunnerMutationOutput") {
              const previousEdge = payload.getLinkedRecord("previous_edge");
              const serverEdge = payload.getLinkedRecord("edge");

              const newEdge = ConnectionHandler.buildConnectionEdge(
                store,
                connectionRecord,
                serverEdge
              );

              ConnectionHandler.insertEdgeAfter(
                connectionRecord,
                // @ts-expect-error
                newEdge,
                previousEdge
              );
            }
          },
        };
        runner_create(config);
      }
    },
    [
      id,
      updateRunner,
      name,
      clazz,
      grade,
      runner_create,
      navigate,
      startTransition,
      location,
    ]
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
            id="name"
            label="Name"
            name="name"
            autoComplete="off"
            autoFocus
            value={name}
            onChange={(e) => setName(e.target.value)}
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
            onChange={(e) => setClazz(e.target.value)}
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
            onChange={(e) => setGrade(parseInt(e.target.value))}
            helperText={gradeError}
            error={gradeError !== null}
          />
          <LoadingButton
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
            loading={
              IsCreateRunnerPending || isUpdateRunnerPending || isPending
            }
          >
            Läufer {id ? "bearbeiten" : "hinzufügen"}
          </LoadingButton>
        </form>
      </div>
    </Container>
  );
}
