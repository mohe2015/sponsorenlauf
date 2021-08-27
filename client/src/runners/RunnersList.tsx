import React, { useState, useContext } from "react";
import { RunnersListQuery } from "./RunnersListQuery";
import { LoadingRunnerRow } from "./RunnerRow";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import Container from "@material-ui/core/Container";
import Box from "@material-ui/core/Box";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons/faPlus";
import TableSortLabel from "@material-ui/core/TableSortLabel";
import { LoadingContext } from "../LoadingContext";
import { useNavigate } from "react-router-dom";
import { useTransition } from "react";
import { useCallback } from "react";
import LoadingButton from "@material-ui/lab/LoadingButton";

//const useStyles = makeStyles({
  // TODO fix #20379.
  //span: visuallyHidden as CSSProperties,
//});

export function RunnersList() {
  //const classes = useStyles();
  const loading = useContext(LoadingContext);
  const navigate = useNavigate();
  const [startTransition, isPending] = useTransition({ busyDelayMs: 1000, busyMinDurationMs: 1500  });

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
        pending={isPending}
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
