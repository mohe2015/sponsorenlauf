import React from "react";
import { useFragment } from 'react-relay/hooks';
import graphql from "babel-plugin-relay/macro";
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import ControlledTooltip from "../ControlledTooltip";
import IconButton from "@material-ui/core/IconButton";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import Skeleton from '@material-ui/lab/Skeleton';
import ReactTimeAgo from 'react-time-ago'

export function LoadingRoundRow(props) {
  return (
    <TableRow>
      <TableCell>
        <Skeleton variant="text" />
      </TableCell>
      <TableCell><Skeleton variant="text" /></TableCell>
      <TableCell><Skeleton variant="text" /></TableCell>
    </TableRow>
  )
}

export function RoundRow(props) {
  const data = useFragment(
    graphql`
    fragment RoundRow_round on Round {
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

  return (
    <TableRow>
      <TableCell>
          {data.student.startNumber}
      </TableCell>
      <TableCell>
          {data.student.name}
      </TableCell>
      <TableCell><ReactTimeAgo date={data.time} locale="de" /></TableCell>
    </TableRow>
  );
}