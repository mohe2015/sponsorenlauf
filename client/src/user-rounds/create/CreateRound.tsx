import React, { Suspense } from "react";
import { useMutation } from "react-relay/hooks";
import { useState, useCallback } from "react";
import { makeStyles } from "@material-ui/core/styles";
import LoadingButton from "@material-ui/lab/LoadingButton";
import Alert from "@material-ui/lab/Alert";
import { useLocation } from "react-router-dom";
import Box from "@material-ui/core/Box";
import { useLazyLoadQuery } from "react-relay/hooks";
import FormControl from "@material-ui/core/FormControl";
import FormHelperText from "@material-ui/core/FormHelperText";
import InputLabel from "@material-ui/core/InputLabel";
import OutlinedInput from "@material-ui/core/OutlinedInput";
import { CreateRoundFindRunnerQuery } from "../../__generated__/CreateRoundFindRunnerQuery.graphql";
import { RecordSourceSelectorProxy, ConnectionHandler } from "relay-runtime";
import { CreateRoundMutation } from "../../__generated__/CreateRoundMutation.graphql";
import { LocationStateType } from "../../utils";
import { Location } from "history";
import graphql from 'babel-plugin-relay/macro';

const useStyles = makeStyles((theme) => ({
  form: {
    width: "100%", // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 0),
  },
}));

function ShowRunnerName({ startNumber }: { startNumber: number }) {
  const data = useLazyLoadQuery<CreateRoundFindRunnerQuery>(
    graphql`
      query CreateRoundFindRunnerQuery($startNumber: Int) {
        runner(where: { startNumber: $startNumber }) {
          id
          startNumber
          name
          clazz
          grade
        }
      }
    `,
    { startNumber: startNumber },
    {
      fetchPolicy: "store-or-network",
      networkCacheConfig: {
        force: false,
      },
    }
  );

  return <>{data.runner ? data.runner.name : "Nicht gefunden"}</>;
}

export function CreateRound() {
  const classes = useStyles();
  const location = useLocation() as Location<LocationStateType | null>;

  const [createOneRound, isCreateOneRoundPending] = useMutation<
    CreateRoundMutation
  >(graphql`
    mutation CreateRoundMutation($startNumber: Int!) {
      createOneRound(
        data: { studentStartNumber: $startNumber }
      ) {
        __typename
        ... on CreateRoundMutationOutput {
          edge {
            cursor
            node {
              id
              ...UserRoundRow_round
            }
          }
        }
        ... on CreateRoundMutationError {
          startNumberError
        }
      }
    }
  `);

  const [startNumber, setStartNumber] = useState<number | null>(null);
  const [startNumberError, setStartNumberError] = useState<string | null>(null);

  const sharedUpdater = (
    store: RecordSourceSelectorProxy<{}>,
    previousEdge: import("relay-runtime").RecordProxy<{}> | null,
    serverEdge: import("relay-runtime").RecordProxy<{}> | null
  ) => {
    const connectionRecord = ConnectionHandler.getConnection(
      store.getRoot(),
      "UserRoundsList_round_rounds",
      {
        orderBy: { id: "desc" },
      }
    );
    if (!connectionRecord) {
      console.log("connection not found");
      return;
    }

    const existingEdges = connectionRecord
      .getLinkedRecords("edges")!
      .map((e) => e.getLinkedRecord("node")!.getValue("id"));
    if (
      existingEdges.includes(
        serverEdge!.getLinkedRecord("node")!.getValue("id")
      )
    ) {
      console.log("node already in connection");
      return;
    }

    const newEdge = ConnectionHandler.buildConnectionEdge(
      store,
      connectionRecord,
      serverEdge
    );

    ConnectionHandler.insertEdgeBefore(
      connectionRecord,
      newEdge!
      //previousEdge!
    );
  };

  const onSubmit = useCallback(
    (event) => {
      event.preventDefault();

      createOneRound({
        onCompleted: (response, errors) => {
          if (errors !== null) {
            console.log(errors);
            alert("Fehler: " + errors.map((e) => e.message).join(", "));
          } else {
            if (
              response.createOneRound.__typename === "CreateRoundMutationError"
            ) {
              setStartNumberError(response.createOneRound.startNumberError);
            } else {
              setStartNumberError(null);
              setStartNumber(null);
            }
          }
        },
        onError: (error) => {
          console.log(error);
          alert(error); // TODO FIXME
        },
        variables: {
          startNumber: startNumber!,
        },
        updater: (store) => {
          const payload = store.getRootField("createOneRound");

          // TODO FIXME type inference
          if (payload.getValue("__typename") === "CreateRoundMutationOutput") {
            const previousEdge = payload.getLinkedRecord("previous_edge");
            const serverEdge = payload.getLinkedRecord("edge");

            sharedUpdater(store, previousEdge, serverEdge);
          }
        },
      });
    },
    [startNumber, createOneRound]
  );

  return (
    <form className={classes.form} onSubmit={onSubmit}>
      {location.state?.errorMessage && (
        <Alert variant="filled" severity="error">
          {location.state?.errorMessage}
        </Alert>
      )}

      <Box display="flex">
        <Box flexGrow={1} pr={1}>
          <FormControl
            disabled={isCreateOneRoundPending}
            variant="outlined"
            margin="normal"
            fullWidth
            error={startNumberError !== null}
          >
            <InputLabel htmlFor="startNumber">Startnummer</InputLabel>
            <OutlinedInput
              id="startNumber"
              name="startNumber"
              type="number"
              autoComplete="off"
              autoFocus
              value={startNumber === null ? "" : startNumber}
              required
              onChange={(e) => {
                setStartNumber(parseInt(e.target.value));
                setStartNumberError(null);
              }}
              label="Startnummer"
              aria-describedby="component-error-text"
            />
            <FormHelperText id="component-error-text">
              {startNumberError !== null ? (
                startNumberError
              ) : startNumber !== null ? (
                <Suspense fallback={<>Wird geladen...</>}>
                  <ShowRunnerName startNumber={startNumber} />
                </Suspense>
              ) : (
                <>-</>
              )}
            </FormHelperText>
          </FormControl>
        </Box>

        <Box>
          <LoadingButton
            type="submit"
            variant="contained"
            color="primary"
            size="large"
            className={classes.submit}
            loading={isCreateOneRoundPending}
          >
            +
          </LoadingButton>
        </Box>
      </Box>
    </form>
  );
}
