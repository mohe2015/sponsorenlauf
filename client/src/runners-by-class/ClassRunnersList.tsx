import React, { useState, useContext } from "react";
import { ClassRunnersListQuery } from './ClassRunnersListQuery';
import { ClassLoadingRunnerRow } from './ClassRunnerRow';
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
import TableSortLabel from '@material-ui/core/TableSortLabel';
import { visuallyHidden } from '@material-ui/system';
import { makeStyles } from '@material-ui/core/styles';
import { LoadingContext } from '../LoadingContext'
import { useNavigate } from "react-router-dom"
import { unstable_useTransition as useTransition } from 'react';
import { useCallback } from 'react';
import LoadingButton from '@material-ui/lab/LoadingButton';
import { CSSProperties } from "@material-ui/core/styles/withStyles";

const useStyles = makeStyles({
  // TODO fix #20379.
  span: visuallyHidden as CSSProperties
,});

export function ClassRunnersList() {
  const classes = useStyles();
  const loading = useContext(LoadingContext)

  return (
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

    { loading ? [...Array(25)].map((e, i) => <ClassLoadingRunnerRow key={i} />) : <ClassRunnersListQuery orderByInput={{ [orderBy]: order }} /> }

  </TableBody>
        </Table>
      </TableContainer>
      </Container>

  )
}