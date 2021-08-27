import React from "react";
import { useFragment } from "react-relay/hooks";
import TableCell from "@material-ui/core/TableCell";
import TableRow from "@material-ui/core/TableRow";
import Skeleton from "@material-ui/core/Skeleton";
import { RoundRow_round$key } from "../__generated__/RoundRow_round.graphql";
import graphql from 'babel-plugin-relay/macro';

export function LoadingRoundRow() {
  return (
    <TableRow>
      <TableCell>
        <Skeleton variant="text" />
      </TableCell>
      <TableCell>
        <Skeleton variant="text" />
      </TableCell>
      <TableCell>
        <Skeleton variant="text" />
      </TableCell>
    </TableRow>
  );
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
    round
  );

  return (
    <TableRow>
      <TableCell>{data.student.startNumber}</TableCell>
      <TableCell>{data.student.name}</TableCell>
      <TableCell>{data.time}</TableCell>
    </TableRow>
  );
}
