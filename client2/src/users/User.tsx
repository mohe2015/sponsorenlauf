import React from "react"
import { createFragmentContainer } from "react-relay"
import { graphql } from "babel-plugin-relay/macro";
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import ControlledTooltip from "../ControlledTooltip";
import { IconButton, Typography, Box } from "@material-ui/core";
import DeleteIcon from '@material-ui/icons/Delete';

function User(props: any) {
  const {id, name, role} = props.user;
  return (
    <TableRow key={name}>
      <TableCell component="th" scope="row">
        {name}
      </TableCell>
      <TableCell align="right">{role}</TableCell>
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

export default createFragmentContainer(User, {
  user: graphql`
    fragment User_user on User {
      id
      name
      role
    }
  `,
});
                  