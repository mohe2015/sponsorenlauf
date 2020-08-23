import React from "react";
import { useFragment, useMutation } from 'react-relay/hooks';
import { unstable_useTransition as useTransition } from 'react';
import graphql from "babel-plugin-relay/macro";
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import ControlledTooltip from "../ControlledTooltip";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import Skeleton from '@material-ui/lab/Skeleton';
import { useConfirm } from 'material-ui-confirm';
import { useCallback } from 'react';
import { ConnectionHandler } from 'relay-runtime';
import { useNavigate } from "react-router-dom"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPen } from '@fortawesome/free-solid-svg-icons'
import { faTrash } from '@fortawesome/free-solid-svg-icons'
import LoadingButton from '@material-ui/lab/LoadingButton';
import { RunnerRow_runner$key } from '../__generated__/RunnerRow_runner.graphql'
import { RunnerRowDeleteRunnerMutation } from "../__generated__/RunnerRowDeleteRunnerMutation.graphql";

export function LoadingRunnerRow() {
  return (
      <TableRow>
      <TableCell component="th" scope="row" align="right">
        <Skeleton variant="text" />
      </TableCell>
      <TableCell><Skeleton variant="text" /></TableCell>
      <TableCell><Skeleton variant="text" /></TableCell>
      <TableCell align="right"><Skeleton variant="text" /></TableCell>
      <TableCell align="right"><Skeleton variant="text" /></TableCell>
      <TableCell align="right">
        <ControlledTooltip title="Bearbeiten">
          <LoadingButton
            disableElevation
            disabled={true}>
              <FontAwesomeIcon style={{ fontSize: 24 }} icon={faPen} />
              <Typography variant="button" noWrap>
                <Box ml={1} component="span" display={{ xs: 'none', md: 'block' }}>Bearbeiten</Box>
              </Typography>
          </LoadingButton>
        </ControlledTooltip>

        <ControlledTooltip title="Löschen">
          <LoadingButton
            disableElevation
            disabled={true}>
              <FontAwesomeIcon style={{ fontSize: 24 }} icon={faTrash} />
              <Typography variant="button" noWrap>
                <Box ml={1} component="span" display={{ xs: 'none', md: 'block' }}>Löschen</Box>
              </Typography>
          </LoadingButton>
        </ControlledTooltip>
      </TableCell>
    </TableRow>
  )
}

export function RunnerRow({ runner }: { runner: RunnerRow_runner$key }) {
  const [startTransition, isPending] = useTransition({ timeoutMs: 3000 });

  const data = useFragment<RunnerRow_runner$key>(
    graphql`
    fragment RunnerRow_runner on Runner {
      id
      startNumber
      name
      clazz
      grade
      roundCount
    }
    `,
    runner,
  );

  const confirm = useConfirm();
  const [deleteRunner, isDeleteRunnerPending] = useMutation<RunnerRowDeleteRunnerMutation>(graphql`
  mutation RunnerRowDeleteRunnerMutation($id: String!) {
    deleteOneRunner(where: { id: $id }) {
      id
    }
  }
  `);

  const deleteRunnerCallback = useCallback(
    event => {
      confirm({
        title: 'Läufer ' + data.name + ' löschen?',
        description: 'Möchtest du den Läufer ' + data.name + ' wirklich löschen? Dies kann nicht rückgängig gemacht werden!',
        confirmationText: 'Löschen',
        cancellationText: 'Abbrechen',
      })
      .then(() => {
        deleteRunner({
          onCompleted: (response, errors) => {
            if (errors !== null) {
              console.log(errors)
              alert("Fehler: " + errors.map(e => e.message).join(", "))
            }
          },
          onError: error => {
            alert(error); // TODO FIXME
          },
          variables: {
            id: data.id
          },
          updater: (store) => {
            const connectionRecord = ConnectionHandler.getConnection(
              store.getRoot(),
              "RunnersList_runner_runners"
            );
            if (!connectionRecord) {
              console.log("connection not found");
              return;
            }

            const payload = store.getRootField("deleteOneRunner");

            if (!payload) {
              throw new Error("deleteOneRunner not found")
            }

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
    [deleteRunner, data, confirm]
  );

  const navigate = useNavigate();

  const updateRunnerCallback = useCallback(
    event => {
      startTransition(() => {
        navigate("/runners/edit/" + data.id, {
          state: {
            data
          }
        })
      })
    },
    [data, navigate, startTransition]
  );

  return (
    <TableRow>
      <TableCell component="th" scope="row" align="right">
        {data.startNumber}
      </TableCell>
      <TableCell>{data.name}</TableCell>
      <TableCell>{data.clazz}</TableCell>
      <TableCell align="right">{data.grade}</TableCell>
      <TableCell align="right">{data.roundCount}</TableCell>
      <TableCell align="right">
        <ControlledTooltip title="Bearbeiten">
          <LoadingButton
            disableElevation
            pending={isPending} onClick={updateRunnerCallback}>
              <FontAwesomeIcon style={{ fontSize: 24 }} icon={faPen} />
              <Typography variant="button" noWrap>
                <Box ml={1} component="span" display={{ xs: 'none', md: 'block' }}>Bearbeiten</Box>
              </Typography>
          </LoadingButton>
        </ControlledTooltip>

        <ControlledTooltip title="Löschen">
          <LoadingButton
            disableElevation
            pending={isDeleteRunnerPending} onClick={deleteRunnerCallback}>
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
