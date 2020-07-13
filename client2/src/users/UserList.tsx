import React from "react";
import { createFragmentContainer } from 'react-relay';
import { graphql } from "babel-plugin-relay/macro";
import User from "./User";
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import { Container, IconButton, Typography, Box } from "@material-ui/core";
import DeleteIcon from '@material-ui/icons/Delete';
import AddIcon from '@material-ui/icons/Add';

type Props = {
  list: any;
};

type State = {
};

class UserList extends React.Component<Props, State> {

  constructor(props: Props) {
    super(props);
  }

  render() {
    return (
      <Container maxWidth="sm">
        <IconButton>
          <AddIcon />
          <Typography variant="button" noWrap>
            <Box component="span">
            Nutzer erstellen
            </Box>
          </Typography>
        </IconButton>
      <TableContainer component={Paper}>
        <Table aria-label="table of users">
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell align="right">Rolle</TableCell>
              <TableCell align="right">Aktionen</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
          {this.props.list.edges.map((user: any) => <User key={user.node.id} user={user.node} />)}
          </TableBody>
        </Table>
      </TableContainer>
      </Container>
    );
  }
}

export default createFragmentContainer(UserList, {
  list: graphql`
    fragment UserList_list on UserConnection {
      pageInfo {
        hasNextPage
      }
      edges {
        node {
          id
          ...User_user
        }
      }
    }
  `,
});