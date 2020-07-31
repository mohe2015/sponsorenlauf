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

export function LoadingRoundRow(props) {
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

export function RoundRow(props) {
  const data = useFragment(
    graphql`
    fragment RoundRow_round on Round {
      id
      student {
        startNumber
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
      <TableCell component="th" scope="row">
        {data.student.startNumber}
      </TableCell>
      <TableCell>{data.time}</TableCell>
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
  );
}