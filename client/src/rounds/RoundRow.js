import React from "react";
import { useFragment } from 'react-relay/hooks';
import graphql from "babel-plugin-relay/macro";
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import Skeleton from '@material-ui/lab/Skeleton';
import TimeAgo from 'react-timeago';
import germanStrings from 'react-timeago/lib/language-strings/de'
import buildFormatter from 'react-timeago/lib/formatters/buildFormatter'

const formatter = buildFormatter(germanStrings)

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
      <TableCell><TimeAgo date={data.time} formatter={formatter} /></TableCell>
    </TableRow>
  );
}