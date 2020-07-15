import React from "react"
import { createFragmentContainer } from "react-relay"
import { graphql } from "babel-plugin-relay/macro";
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import ControlledTooltip from "../ControlledTooltip";
import IconButton from "@material-ui/core/IconButton";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import DeleteIcon from '@material-ui/icons/Delete';
import Checkbox from "@material-ui/core/Checkbox";

function Runner(props: any) {
  const { isItemSelected, labelId, handleClick } = props;
  return (
    <TableRow
      hover
      onClick={(event) => handleClick(event, props.runner.id)}
      role="checkbox"
      aria-checked={isItemSelected}
      tabIndex={-1}
      selected={isItemSelected}
    >
      <TableCell padding="checkbox">
        <Checkbox
          checked={isItemSelected}
          inputProps={{ 'aria-labelledby': labelId }}
        />
      </TableCell>
      <TableCell component="th" id={labelId} scope="row" padding="none">
        {props.runner.name}
      </TableCell>
      <TableCell align="right">{props.runner.startNumber}</TableCell>
      <TableCell align="right">{props.runner.clazz}</TableCell>
      <TableCell align="right">{props.runner.grade}</TableCell>
    </TableRow>
  );
}

export default createFragmentContainer(Runner, {
  runner: graphql`
    fragment Runner_runner on Runner {
      id
      startNumber
      name
      clazz
      grade
    }
  `,
});
                  