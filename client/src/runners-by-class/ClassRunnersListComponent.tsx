import React from "react";
import { useLazyLoadQuery } from "react-relay/hooks";
import { ClassRunnerRow } from "./ClassRunnerRow";
import { ClassRunnersListComponentRunnersByClassQuery } from "../__generated__/ClassRunnersListComponentRunnersByClassQuery.graphql";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Container from "@mui/material/Container";
import { Theme } from "@mui/material";
import { makeStyles } from "@mui/styles";
import graphql from 'babel-plugin-relay/macro';

const useStyles = makeStyles((theme: Theme) => ({
  center_header: {
    textAlign: "center",
    margin: 0,
  },
  avoid_page_break: {
    // pageBreakInside: "avoid",
    breakInside: "avoid-page",
  },
}));

export function ClassRunnersListComponent() {
  const classes = useStyles();

  const data = useLazyLoadQuery<ClassRunnersListComponentRunnersByClassQuery>(
    graphql`
      query ClassRunnersListComponentRunnersByClassQuery {
        runnersByClass {
          class
          runners {
            id
            ...ClassRunnerRow_runner
          }
        }
      }
    `,
    {},
    {
      fetchPolicy: "store-or-network",
      networkCacheConfig: {
        force: false,
      },
    }
  );

  return (
    <>
      {data.runnersByClass.map((classWithRunners) => {
        return (
          <div
            className={classes.avoid_page_break}
            key={classWithRunners.class}
          >
            <Container maxWidth="md">
              <TableContainer component={Paper}>
                <Table size="small" aria-label="Liste der Läufer">
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
                    {classWithRunners.runners.map((runner) => (
                      <ClassRunnerRow key={runner.id} runner={runner} />
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Container>
          </div>
        );
      })}
    </>
  );
}
