import React from "react";
import { useFragment } from "react-relay/hooks";
import TableCell from "@material-ui/core/TableCell";
import TableRow from "@material-ui/core/TableRow";
import graphql from 'babel-plugin-relay/macro';

export function ClassRunnerRow({
  runner,
}: {
  runner: any
}) {
  const data = useFragment(
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
    runner
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
