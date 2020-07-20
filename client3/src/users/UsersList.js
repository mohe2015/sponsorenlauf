import React from "react";
import { useLazyLoadQuery } from 'react-relay/hooks';
import graphql from "babel-plugin-relay/macro";
import { UsersListQuery } from './UsersListQuery';
import { LoadingUserRow } from './UserRow';
import { Suspense } from 'react';
import CircularProgress from '@material-ui/core/CircularProgress';
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

export function UsersList(props) {
  return (
    <Container maxWidth="sm">
    <IconButton component={RouterLink} to="/users/create">
      <FontAwesomeIcon icon={faPlus} />
      <Typography variant="button" noWrap>
        <Box component="span" ml={1}>
          Nutzer erstellen
        </Box>
      </Typography>
    </IconButton>
  <TableContainer component={Paper}>
    <Table aria-label="table of users">
      <TableHead>
        <TableRow>
          <TableCell>Name</TableCell>
          <TableCell>Rolle</TableCell>
          <TableCell align="right">Aktionen</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>

  {props.loading ? [...Array(25)].map((e, i) => <LoadingUserRow key={i} />) : <UsersListQuery /> }
  
  </TableBody>
        </Table>
      </TableContainer>
      </Container>
  )
}