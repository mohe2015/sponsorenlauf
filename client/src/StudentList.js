import React from 'react';
import {QueryRenderer} from 'react-relay';
import environment from './environment'
import graphql from 'babel-plugin-relay/macro';
import Student from './Student'
import Table from 'react-bootstrap/Table'

export default class StudentList extends React.Component {
  render() {
    return (
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Startnummer</th>
            <th>Name</th>
            <th>Klasse</th>
            <th>Jahrgang</th>
          </tr>
        </thead>
        <tbody>
          {this.props.viewer.map((student) =>
              <Student key={student.__id} student={student} />
          )}
        </tbody>
      </Table>
    );
  }
}
