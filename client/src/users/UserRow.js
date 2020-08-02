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
import { useConfirm } from 'material-ui-confirm';

export function LoadingUserRow(props) {
  return (
    <TableRow>
      <TableCell component="th" scope="row">
        <Skeleton variant="text" />
      </TableCell>
      <TableCell><Skeleton variant="text" /></TableCell>
      <TableCell align="right">
        <ControlledTooltip title="Löschen">
          <IconButton>
            <Typography variant="button" noWrap>
              <Box component="span" display={{ xs: 'none', md: 'block' }}>
              Löschen
              </Box>
            </Typography>
          </IconButton>
        </ControlledTooltip>
      </TableCell>
    </TableRow>
  )
}

export function UserRow(props) {
  const data = useFragment(
    graphql`
    fragment UserRow_user on User {
      id
      name
      role
    }
    `,
    props.user,
  );
  const confirm = useConfirm();

  return (
    <TableRow>
      <TableCell component="th" scope="row">
        {data.name}
      </TableCell>
      <TableCell>{data.role}</TableCell>
      <TableCell align="right">
        <ControlledTooltip title="Löschen">
          <IconButton onClick={() => {
            confirm({
              title: 'Schüler ' + data.name + ' löschen?',
              description: 'Möchtest du den Schüler ' + data.name + ' wirklich löschen? Dies kann nicht rückgängig gemacht werden!',
              confirmationText: 'Löschen',
              cancellationText: 'Abbrechen',
            })
            .then(() => { 
              // DELETE

             });
          }}>
            
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