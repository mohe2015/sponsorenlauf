import React from "react";
import { createFragmentContainer } from 'react-relay';
import { graphql } from "babel-plugin-relay/macro";
import Runner from "./Runner";
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Typography from "@material-ui/core/Typography";
import Container from "@material-ui/core/Container";
import IconButton from "@material-ui/core/IconButton";
import Box from "@material-ui/core/Box";
import AddIcon from '@material-ui/icons/Add';
import { CircularProgress } from "@material-ui/core";
import Skeleton from '@material-ui/lab/Skeleton';
import ControlledTooltip from "../ControlledTooltip";
import DeleteIcon from '@material-ui/icons/Delete';

type Props = {
  list: any;
  loading: boolean;
};

type State = {
};

class RunnerList extends React.Component<Props, State> {

  render() {
    return (
      <Container maxWidth="sm">
        <IconButton>
          <AddIcon />
          <Typography variant="button" noWrap>
            <Box component="span">
            Läufer erstellen
            </Box>
          </Typography>
        </IconButton>
      <TableContainer component={Paper}>
        <Table aria-label="Liste der Läufer">
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell align="right">Rolle</TableCell>
              <TableCell align="right">Aktionen</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>

          {this.props.loading && [...Array(5)].map((e, i) => 
            <TableRow key={i}>
              <TableCell component="th" scope="row">
                <Skeleton variant="text" />
              </TableCell>
              <TableCell align="right">
                <Skeleton variant="text" />
              </TableCell>
              <TableCell align="right">
                <ControlledTooltip title="Löschen">
                  <IconButton>
                    <DeleteIcon />
                    <Typography variant="button" noWrap>
                      <Box component="span" display={{ xs: 'none', md: 'block' }}>
                      Löschen
                      </Box>
                    </Typography>
                  </IconButton>
                </ControlledTooltip>
              </TableCell>
            </TableRow>)}


          {!this.props.loading && this.props.list.edges.map((runner: any) => <Runner key={runner.node.id} runner={runner.node} />)}
          
          
          </TableBody>
        </Table>
      </TableContainer>
      </Container>
    );
  }
}

export default createFragmentContainer(RunnerList, {
  list: graphql`
    fragment RunnerList_list on RunnerConnection {
      pageInfo {
        hasNextPage
      }
      edges {
        node {
          id
          ...Runner_runner
        }
      }
    }
  `,
});