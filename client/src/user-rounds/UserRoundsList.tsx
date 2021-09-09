import React, { useContext } from "react";
import { UserRoundsListQuery } from "./UserRoundsListQuery";
import { LoadingRoundRow } from "../rounds/RoundRow";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Container from "@mui/material/Container";
import { CreateRound } from "./create/CreateRound";
import { LoadingContext } from "../LoadingContext";

export function UserRoundsList() {
  const loading = useContext(LoadingContext);

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
            {loading ? (
              [...Array(25)].map((e, i) => <LoadingRoundRow key={i} />)
            ) : (
              <UserRoundsListQuery />
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
}
