import React, { useContext, useState } from "react";
import { UsersListQuery } from "./UsersListQuery";
import { LoadingUserRow } from "./UserRow";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons/faPlus";
import { LoadingContext } from "../LoadingContext";
import { useNavigate } from "react-router-dom";
import { useTransition } from "react";
import { useCallback } from "react";
import LoadingButton from "@mui/lab/LoadingButton";
import { GenerateUserPasswords } from "./GenerateUserPasswords";
import { UsersListPasswordsComponent_user$key } from "../__generated__/UsersListPasswordsComponent_user.graphql";
import { UsersListPasswordsComponent } from "./UsersListPasswordsComponent";

export function UsersList() {
  const loading = useContext(LoadingContext);
  const navigate = useNavigate();
  const [isPending, startTransition] = useTransition();

  const createUser = useCallback(
    (event) => {
      startTransition(() => {
        navigate("/users/create");
      });
    },
    [navigate, startTransition]
  );
  
  const [generatedPasswordsData, setGeneratedPasswordsData] = useState<UsersListPasswordsComponent_user$key | null>(null);

  return (
    <Container maxWidth="md">
      <LoadingButton disableElevation loading={isPending} onClick={createUser}>
        <FontAwesomeIcon style={{ fontSize: 24 }} icon={faPlus} />
        <Typography variant="button" noWrap>
          <Box component="span" ml={1}>
            Nutzer erstellen
          </Box>
        </Typography>
      </LoadingButton>
      <GenerateUserPasswords setGeneratedPasswordsData={setGeneratedPasswordsData} />
      <TableContainer component={Paper}>
        <Table aria-label="table of users">
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Rolle</TableCell>
              <TableCell>Passwort</TableCell>
              <TableCell align="right">Aktionen</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              [...Array(25)].map((e, i) => <LoadingUserRow key={i} />)
            ) : (generatedPasswordsData ? <UsersListPasswordsComponent users={generatedPasswordsData} /> :
              <UsersListQuery />
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
}
