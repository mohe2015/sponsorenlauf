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
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPen } from '@fortawesome/free-solid-svg-icons'
import { faTrash } from '@fortawesome/free-solid-svg-icons'
import LoadingButton from '@material-ui/lab/LoadingButton';
import { ClassRunnerRow_runner$key } from "../__generated__/ClassRunnerRow_runner.graphql";

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
