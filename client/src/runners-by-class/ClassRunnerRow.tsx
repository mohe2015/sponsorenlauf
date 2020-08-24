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

export function ClassLoadingRunnerRow() {
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

export function ClassRunnerRow({ runner }: { runner: ClassRunnerRow_runner$key }) {
  const [startTransition, isPending] = useTransition({ timeoutMs: 3000 });

  const data = useFragment<ClassRunnerRow_runner$key>(
    graphql`
    fragment ClassRunnerRow_runner on Runner {
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

  return (
    <TableRow>
      <TableCell component="th" scope="row" align="right">
        {data.startNumber}
      </TableCell>
      <TableCell>{data.name}</TableCell>
      <TableCell>{data.clazz}</TableCell>
      <TableCell align="right">{data.grade}</TableCell>
      <TableCell align="right">{data.roundCount}</TableCell>
    </TableRow>
  );
}
