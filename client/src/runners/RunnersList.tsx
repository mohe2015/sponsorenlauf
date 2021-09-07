import React, { useState, useContext } from "react";
import { RunnersListQuery } from "./RunnersListQuery";
import { LoadingRunnerRow } from "./RunnerRow";
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
import TableSortLabel from "@mui/material/TableSortLabel";
import { LoadingContext } from "../LoadingContext";
import { useNavigate } from "react-router-dom";
import { useTransition } from "react";
import { useCallback } from "react";
import LoadingButton from "@mui/lab/LoadingButton";

//const useStyles = makeStyles({
  // TODO fix #20379.
  //span: visuallyHidden as CSSProperties,
//});

export function RunnersList() {
  //const classes = useStyles();
  const loading = useContext(LoadingContext);
  const navigate = useNavigate();
  const [isPending, startTransition] = useTransition();

  const createRunner = useCallback(
    (event) => {
      startTransition(() => {
        navigate("/runners/create");
      });
    },
    [navigate, startTransition]
  );

  const [orderBy, setOrderBy] = useState("id");
  const [order, setOrder] = useState<"asc" | "desc">("asc");

  const handleRequestSort = (
    event: React.MouseEvent<HTMLAnchorElement, MouseEvent>,
    property: React.SetStateAction<string>
  ) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const createSortHandler = (property: string) => (
    event: React.MouseEvent<HTMLAnchorElement, MouseEvent>
  ) => {
    handleRequestSort(event, property);
  };

  return (
    <Container maxWidth="md">
      <LoadingButton
        disableElevation
        loading={isPending}
        onClick={createRunner}
      >
        <FontAwesomeIcon style={{ fontSize: 24 }} icon={faPlus} />
        <Typography variant="button" noWrap>
          <Box component="span" ml={1}>
            Läufer erstellen
          </Box>
        </Typography>
      </LoadingButton>
      <TableContainer component={Paper}>
        <Table aria-label="Liste der Läufer">
          <TableHead>
            <TableRow>
              <TableCell align="right">Startnummer</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Klasse</TableCell>
              <TableCell align="right">Jahrgang</TableCell>
              <TableCell
                align="right"
                sortDirection={orderBy === "roundCount" ? order : false}
              >
                <TableSortLabel
                  active={orderBy === "roundCount"}
                  direction={orderBy === "roundCount" ? order : "asc"}
                  onClick={createSortHandler("roundCount")}
                >
                  Rundenzahl
                  {orderBy === "roundCount" ? (
                    <span>
                      {order === "desc"
                        ? "sorted descending"
                        : "sorted ascending"}
                    </span>
                  ) : null}
                </TableSortLabel>
              </TableCell>
              <TableCell align="right">Aktionen</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              [...Array(25)].map((e, i) => <LoadingRunnerRow key={i} />)
            ) : (
              <RunnersListQuery orderByInput={{ [orderBy]: order }} />
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
}
