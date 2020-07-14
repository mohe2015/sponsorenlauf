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
import {createPaginationContainer} from 'react-relay';

type Props = {
  relay: any;
  list: any;
  loading: any;
};

type State = {
};

class PaginatedRunnerList extends React.Component<Props, State> {

  _loadMore = () => {
    if (!this.props.relay.hasMore() || this.props.relay.isLoading()) {
      return;
    }

    this.props.relay.loadMore(
      10,  // Fetch the next 10 feed items
      (error: any) => {
        console.log(error);
      },
    );
  }

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


          {!this.props.loading && this.props.list.runners.edges.map((runner: any) => <Runner key={runner.node.id} runner={runner.node} />)}
          
          </TableBody>
        </Table>
      </TableContainer>
      </Container>
    );
  }
}

export default createPaginationContainer(PaginatedRunnerList, {
  list: graphql`
    fragment PaginatedRunnerList_list on Query
    @argumentDefinitions(
      count: {type: "Int", defaultValue: 10}
      cursor: {type: "String"}
    ) {
      runners(first: $count, after: $cursor) @connection(key: "Runner_runners") {
        edges {
          node {
            id
            ...Runner_runner
          }
        }
      }
    }
  `,
}, {
  direction: 'forward',
    getConnectionFromProps(props) { // TODO try withouth
      return props.list;
    },
    getVariables(props, {count, cursor}, fragmentVariables) {
      return {
        count,
        cursor,
      };
    },
    query: graphql`
      # Pagination query to be fetched upon calling 'loadMore'.
      # Notice that we re-use our fragment, and the shape of this query matches our fragment spec.
      query PaginatedRunnerListQuery (
        $count: Int!
        $cursor: ID
      ) {
          ...PaginatedRunnerList_list @arguments(count: $count, cursor: $cursor)
      }
    `
});