import React from "react";
import { RunnersListQuery } from './RunnersListQuery';
import { LoadingRunnerRow } from './RunnerRow';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Typography from "@material-ui/core/Typography";
import Container from "@material-ui/core/Container";
import IconButton from "@material-ui/core/IconButton";
import Box from "@material-ui/core/Box";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus } from '@fortawesome/free-solid-svg-icons'
import { Link as RouterLink } from 'react-router-dom';

export function RunnersList(props) {
  return (
    <Container maxWidth="md">
    <IconButton component={RouterLink} to="/runners/create">
      <FontAwesomeIcon icon={faPlus} />
      <Typography variant="button" noWrap>
        <Box component="span" ml={1}>
          Läufer erstellen
        </Box>
      </Typography>
    </IconButton>
  <TableContainer component={Paper}>
    <Table aria-label="Liste der Läufer">
      <TableHead>
        <TableRow>
          <TableCell align="right">Startnummer</TableCell>
          <TableCell>Name</TableCell>
          <TableCell>Klasse</TableCell>
          <TableCell align="right">Jahrgang</TableCell>
          <TableCell align="right">Rundenzahl</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>

      {props.loading ? [...Array(25)].map((e, i) => <LoadingRunnerRow key={i} />) : <RunnersListQuery /> }
  
  </TableBody>
        </Table>
      </TableContainer>
      </Container>
  )
}