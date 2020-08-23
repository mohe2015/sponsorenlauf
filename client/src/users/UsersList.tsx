import React, { useContext } from "react";
import { UsersListQuery } from './UsersListQuery';
import { LoadingUserRow } from './UserRow';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Typography from "@material-ui/core/Typography";
import Container from "@material-ui/core/Container";
import Box from "@material-ui/core/Box";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus } from '@fortawesome/free-solid-svg-icons'
import { LoadingContext } from '../LoadingContext'
import { useNavigate } from "react-router-dom"
import { unstable_useTransition as useTransition } from 'react';
import { useCallback } from 'react';
import LoadingButton from '@material-ui/lab/LoadingButton';

export function UsersList() {
  const loading = useContext(LoadingContext)
  const navigate = useNavigate();
  const [startTransition, isPending] = useTransition({ timeoutMs: 3000 });

  const createUser = useCallback(event => {
      startTransition(() => {
        navigate("/users/create")
      })
    },
    [navigate, startTransition]
  );

  return (
    <Container maxWidth="sm">
      <LoadingButton
        disableElevation
        pending={isPending} onClick={createUser}>
        <FontAwesomeIcon style={{ fontSize: 24 }} icon={faPlus} />
        <Typography variant="button" noWrap>
          <Box component="span" ml={1}>
            Nutzer erstellen
          </Box>
        </Typography>
      </LoadingButton>
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

      { loading ?
        [...Array(25)].map((e, i) => <LoadingUserRow key={i} />) :
        <UsersListQuery />
      }

  </TableBody>
        </Table>
      </TableContainer>
      </Container>
  )
}