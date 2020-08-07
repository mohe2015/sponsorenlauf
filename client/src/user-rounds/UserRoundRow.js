import React from "react";
import { useFragment, useMutation } from 'react-relay/hooks';
import graphql from "babel-plugin-relay/macro";
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import ControlledTooltip from "../ControlledTooltip";
import IconButton from "@material-ui/core/IconButton";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import Skeleton from '@material-ui/lab/Skeleton';
import { useConfirm } from 'material-ui-confirm';
import { useCallback } from 'react';
import { ConnectionHandler } from 'react-relay';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrash } from '@fortawesome/free-solid-svg-icons'
import LoadingButton from '@material-ui/lab/LoadingButton';

export function LoadingRoundRow(props) {
  return (
    <TableRow>
      <TableCell component="th" scope="row">
        <Skeleton variant="text" />
      </TableCell>
      <TableCell><Skeleton variant="text" /></TableCell>
      <TableCell align="right">
        <ControlledTooltip title="Löschen">
          <IconButton>
            <Typography variant="button" noWrap>
              <Box component="span" display={{ xs: 'none', md: 'block' }}>
              Löschen
              </Box>
            </Typography>
          </IconButton>
        </ControlledTooltip>
      </TableCell>
    </TableRow>
  )
}

export function UserRoundRow(props) {
  const data = useFragment(
    graphql`
    fragment UserRoundRow_round on Round {
      id
      student {
        startNumber
        name
      }
      time
      createdBy {
        name
      }
    }
    `,
    props.round,
  );

  const confirm = useConfirm();
  const [deleteRound, isDeleteRoundPending] = useMutation(graphql`
  mutation UserRoundRowDeleteRoundMutation($id: String!) {
    deleteOneRound(where: { id: $id }) {
      id
    }
  }
  `);

  const deleteRoundCallback = useCallback(
    event => {
      confirm({
        title: 'Runde von ' + data.student.startNumber + " (" + data.student.name + ') löschen?',
        description: 'Möchtest du die Runde von ' + data.student.startNumber + " (" + data.student.name + ') wirklich löschen? Dies kann nicht rückgängig gemacht werden!',
        confirmationText: 'Löschen',
        cancellationText: 'Abbrechen',
      })
      .then(() => {
        deleteRound({
          onCompleted: response => { },
          onError: error => {
            alert(error); // TODO FIXME
          },
          variables: {
            id: data.id
          },
          updater: (store) => {
            const connectionRecord = ConnectionHandler.getConnection(
              store.getRoot(),
              "UserRoundsList_round_rounds",
              {
                orderBy: { id: 'desc' },
              }
            );
            if (!connectionRecord) {
              console.log("connection not found");
              return;
            }

            const payload = store.getRootField("deleteOneRound");

            const id = payload.getValue('id');

            ConnectionHandler.deleteNode(
              connectionRecord,
              id,
            );
          }
        })
      })
      .catch(() => {
        // do nothing
      })
    },
    [deleteRound, data, confirm]
  );

  return (
    <TableRow>
      <TableCell component="th" scope="row">
        
          {data.student.startNumber}
      </TableCell>
      <TableCell>{data.time}</TableCell>
      <TableCell align="right">
        <ControlledTooltip title="Löschen">
          <LoadingButton
            disableElevation
            pending={isDeleteRoundPending} onClick={deleteRoundCallback}>
              <FontAwesomeIcon style={{ fontSize: 24 }} icon={faTrash} />
              <Typography variant="button" noWrap>
                <Box ml={1} component="span" display={{ xs: 'none', md: 'block' }}>Löschen</Box>
              </Typography>
          </LoadingButton>
        </ControlledTooltip>
      </TableCell>
    </TableRow>
  );
}