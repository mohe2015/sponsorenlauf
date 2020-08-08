import React, { useContext } from "react";
import { RoundsListQuery } from './RoundsListQuery';
import { LoadingRoundRow } from './RoundRow';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Container from "@material-ui/core/Container";
import { LoadingContext } from '../LoadingContext'

export function RoundsList(props) {
  const loading = useContext(LoadingContext)

  return (
    <Container maxWidth="sm">
  <TableContainer component={Paper}>
    <Table aria-label="table of rounds">
      <TableHead>
        <TableRow>
          <TableCell>Startnummer</TableCell>
          <TableCell>Zeit</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>

  { loading ? [...Array(25)].map((e, i) => <LoadingRoundRow key={i} />) : <RoundsListQuery /> }
  
  </TableBody>
        </Table>
      </TableContainer>
      </Container>
  )
}