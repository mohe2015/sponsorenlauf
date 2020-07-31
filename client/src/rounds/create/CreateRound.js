import React from 'react';
import { useMutation } from 'react-relay/hooks';
import graphql from "babel-plugin-relay/macro";
import { useState, useCallback, unstable_useTransition as useTransition } from 'react';
import TextField from '@material-ui/core/TextField';
import { makeStyles } from '@material-ui/core/styles';
import LoadingButton from '@material-ui/lab/LoadingButton';
import Alert from '@material-ui/lab/Alert';
import { useNavigate, useLocation } from "react-router-dom";
import { ConnectionHandler } from 'react-relay';
import Box from '@material-ui/core/Box';

const useStyles = makeStyles((theme) => ({
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 0),
  },
}));

export function CreateRound(props) {
  const classes = useStyles();
  const navigate = useNavigate();
  const location = useLocation();

  const [round_create, isCreateOneRoundPending] = useMutation(graphql`
  mutation CreateRoundMutation($startNumber: Int!) {
    round_create(data: { startNumber: $startNumber }) {
      __typename
      ... on CreateRoundMutationOutput {
        round_edge {
          cursor
          node {
            id
          }
        }
      }
      ... on CreateRoundMutationError {
        startNumberError
      }
    }
  }
  `);

  const [startNumber, setStartNumber] = useState('');
  const [startNumberError, setStartNumberError] = useState(null);

  const [startTransition, isPending] = useTransition({ timeoutMs: 3000 });

  const onSubmit = useCallback(
    event => {
      event.preventDefault();

      round_create({
        onCompleted: response => {
          if (response.round_create.__typename === "CreateRoundMutationError") {
            setStartNumberError(response.round_create.startNumberError);
          } else {
            setStartNumberError(null);

            startTransition(() => {
              if (location.state?.oldPathname) {
                navigate(location.state?.oldPathname);
              } else {
                navigate("/rounds");
              }
            });
          }
        },
        onError: error => {
          console.log(error);
          alert(error); // TODO FIXME
        },
        variables: {
          startNumber: parseInt(startNumber)
        },
        updater: (store) => {
          const connectionRecord = ConnectionHandler.getConnection(
            store.getRoot(),
            "RoundsList_round_rounds"
          );
          if (!connectionRecord) {
            console.log("connection not found");
            return;
          }


          const payload = store.getRootField("round_create");

          const previousEdge = payload.getLinkedRecord('previous_edge');
          const serverEdge = payload.getLinkedRecord('round_edge');

          const existingEdges = connectionRecord.getLinkedRecords("edges").map(e => e.getLinkedRecord("node").getValue("id"));
          if (existingEdges.includes(serverEdge.getLinkedRecord("node").getValue("id"))) {
            console.log("node already in connection")
            return;
          }

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
    [startNumber, round_create, navigate, startTransition, location]
  );

    return (
      <form className={classes.form} onSubmit={onSubmit}>
          {location.state?.errorMessage && <Alert variant="filled" severity="error">
            {location.state?.errorMessage}
          </Alert>}


          <Box display="flex">
            <Box flexGrow={1} pr={1}>
                <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                id="startNumber"
                label="Startnummer"
                name="startNumber"
                type="number"
                autoComplete="off"
                autoFocus
                value={startNumber}
                onChange={e => setStartNumber(e.target.value)}
                helperText={startNumberError}
                error={startNumberError !== null}
              />
            </Box>
            <Box>
              <LoadingButton
                type="submit"
                variant="contained"
                color="primary"
                size="large"
                className={classes.submit}
                pending={isCreateOneRoundPending || isPending}
              >
                +
              </LoadingButton>
            </Box>
          </Box>

          
         
      </form>
    )
}