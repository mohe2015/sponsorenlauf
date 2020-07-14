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

function Runner(props: any) {
  const {id, startNumber, name, clazz, grade} = props.runner;
  return (
    <TableRow key={name}>
      <TableCell component="th" scope="row">
        {name}
      </TableCell>
      <TableCell align="right">{startNumber}</TableCell>
      <TableCell align="right">
        <ControlledTooltip title="Löschen">
          <IconButton>
            <DeleteIcon />
            <Typography variant="button" noWrap>
              <Box component="span" display={{ xs: 'none', md: 'block' }}>
              Löschen
              </Box>
            </Typography>
          </IconButton>
        </ControlledTooltip>
      </TableCell>
    </TableRow>
  );
}

export default createFragmentContainer(Runner, {
  user: graphql`
    fragment User_user on User {
      id
      name
      role
    }
  `,
});
                  