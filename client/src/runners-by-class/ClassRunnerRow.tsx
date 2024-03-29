import React from "react";
import { useFragment } from "react-relay/hooks";
import TableCell from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";
import graphql from "babel-plugin-relay/macro";
import { ClassRunnerRow_runner$key } from "../__generated__/ClassRunnerRow_runner.graphql";

export function ClassRunnerRow({
  runner,
}: {
  runner: ClassRunnerRow_runner$key;
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
