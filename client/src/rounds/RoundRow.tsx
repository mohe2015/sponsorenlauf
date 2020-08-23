import React from "react";
import { useFragment } from 'react-relay/hooks';
import graphql from "babel-plugin-relay/macro";
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import Skeleton from '@material-ui/lab/Skeleton';
import TimeAgo from 'react-timeago';
// @ts-expect-error
import germanStrings from 'react-timeago/lib/language-strings/de'
// @ts-expect-error
import buildFormatter from 'react-timeago/lib/formatters/buildFormatter'
import { RoundRow_round, RoundRow_round$key } from "../__generated__/RoundRow_round.graphql";

const formatter = buildFormatter(germanStrings)

export function LoadingRoundRow() {
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

export function RoundRow({ round }: { round: RoundRow_round$key }) {
  const data = useFragment<RoundRow_round$key>(
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
    round,
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