import React from "react";
import { useLazyLoadQuery } from "react-relay/hooks";
import { ClassRunnerRow } from "./ClassRunnerRow";
import { ClassRunnersListComponentRunnersByClassQuery } from "../__generated__/ClassRunnersListComponentRunnersByClassQuery.graphql";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import Container from "@material-ui/core/Container";
import { Theme } from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";
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
