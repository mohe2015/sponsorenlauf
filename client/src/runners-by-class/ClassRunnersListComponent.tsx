import React from "react";
import { useLazyLoadQuery, usePaginationFragment } from 'react-relay/hooks';
import graphql from "babel-plugin-relay/macro";
import { ClassRunnerRow } from './ClassRunnerRow'
import { unstable_useTransition as useTransition } from 'react';
import { ClassRunnersListComponentRunnersByClassQuery } from "../__generated__/ClassRunnersListComponentRunnersByClassQuery.graphql";
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Container from "@material-ui/core/Container";

export function ClassRunnersListComponent() {
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
        force: false
      }
  })

  return (<>
    {data.runnersByClass.map(classWithRunners => {
      return (<>
      <div key={classWithRunners.class}>
        <h1>{classWithRunners.class}</h1>
        <Container maxWidth="md">
  <TableContainer component={Paper}>
    <Table aria-label="Liste der Läufer">
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
        {classWithRunners.runners.map(runner => {
          <ClassRunnerRow key={runner.id} runner={runner} />
        })}
  </TableBody>
        </Table>
      </TableContainer>
      </Container>
      </div>
      </>
      );
    })}
  </>
  );
}