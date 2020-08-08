import React, { useContext } from "react";
import { UserRoundsListQuery } from './UserRoundsListQuery';
import { LoadingRoundRow } from './../rounds/RoundRow';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Container from "@material-ui/core/Container";
import { CreateRound } from "./create/CreateRound";
import { LoadingContext } from '../LoadingContext'

export function UserRoundsList(props) {
  const loading = useContext(LoadingContext)

  return (
    <Container maxWidth="md">
    <CreateRound />
  <TableContainer component={Paper}>
    <Table aria-label="table of rounds">
      <TableHead>
        <TableRow>
          <TableCell>Startnummer</TableCell>
          <TableCell>Name</TableCell>
          <TableCell>Zeit</TableCell>
          <TableCell align="right">Aktionen</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>

  {loading ? [...Array(25)].map((e, i) => <LoadingRoundRow key={i} />) : <UserRoundsListQuery /> }
  
  </TableBody>
        </Table>
      </TableContainer>
      </Container>
  )
}