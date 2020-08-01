import React from 'react';
import { useMutation } from 'react-relay/hooks';
import graphql from "babel-plugin-relay/macro";
import { useState, useCallback } from 'react';
import TextField from '@material-ui/core/TextField';
import { makeStyles } from '@material-ui/core/styles';
import LoadingButton from '@material-ui/lab/LoadingButton';
import Alert from '@material-ui/lab/Alert';
import { useLocation } from "react-router-dom";
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
            ...RoundRow_round
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

  const sharedUpdater = (store, previousEdge, serverEdge) => {
    const connectionRecord = ConnectionHandler.getConnection(
      store.getRoot(),
      "UserRoundsList_round_rounds"
    );
    if (!connectionRecord) {
      console.log("connection not found");
      return;
    }

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

    ConnectionHandler.insertEdgeBefore(
      connectionRecord,
      newEdge,
      previousEdge
    );
  }

  const onSubmit = useCallback(
    event => {
      event.preventDefault();

      round_create({
        onCompleted: response => {
          if (response.round_create.__typename === "CreateRoundMutationError") {
            setStartNumberError(response.round_create.startNumberError);
          } else {
            setStartNumberError(null);
            setStartNumber('');
          }
        },
        onError: error => {
          console.log(error);
          alert(error); // TODO FIXME
        },
        variables: {
          startNumber: parseInt(startNumber)
        },
        optimisticUpdater: (store) => {
          // TODO FIXME strange UI updates as subscription gets received

          // https://github.com/facebook/relay/commit/c988815ff9b1b4dd236c83413c55b352bbae0266
          // https://github.com/facebook/relay/issues/2077

          const roundId = 'client:newRound';
          const roundNode = store.create(roundId, 'Round');
          roundNode.setValue(roundId, 'id');

          const studentId = 'client:newStudent';
          const studentNode = store.create(studentId, 'Student');
          studentNode.setValue(studentId, 'id');
          studentNode.setValue(startNumber, 'startNumber');

          roundNode.setValue("now", 'time');

          const userId = 'client:newUser';
          const userNode = store.create(userId, 'User');
          userNode.setValue(userId, 'id');
          userNode.setValue("Test", 'name');

          roundNode.setLinkedRecord(studentNode, 'student');
          roundNode.setLinkedRecord(userNode, 'createdBy');

          // Create a new edge that contains the newly created Todo Item
          const newEdge = store.create(
            'client:newEdge',
            'RoundEdge',
          );
          newEdge.setLinkedRecord(roundNode, 'node');

          sharedUpdater(store, null, newEdge)
        },
        updater: (store) => {
          const payload = store.getRootField("round_create");

          const previousEdge = payload.getLinkedRecord('previous_edge');
          const serverEdge = payload.getLinkedRecord('round_edge');

          sharedUpdater(store, previousEdge, serverEdge)
        }
      })
    },
    [startNumber, round_create]
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
                pending={isCreateOneRoundPending}
              >
                +
              </LoadingButton>
            </Box>
          </Box>

          
         
      </form>
    )
}