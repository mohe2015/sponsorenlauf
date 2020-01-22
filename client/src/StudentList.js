import React from 'react';
import {QueryRenderer} from 'react-relay';
import environment from './environment'
import graphql from 'babel-plugin-relay/macro';
import Student from './Student'
import Table from 'react-bootstrap/Table'

export default class StudentList extends React.Component {
  
  groupBy = function(xs, key) {
    return xs.reduce(function(rv, x) {
      (rv[x[key]] = rv[x[key]] || []).push(x);
      return rv;
    }, {});
  };

  values = (dictionary) => {
    return Object.keys(dictionary).map(function(key){
      return dictionary[key];
    });
  }

  render() {
    return (
      <div>
      {this.values(this.groupBy(this.props.viewer, 'class')).map(clazz =>
        <Table striped bordered hover style={{pageBreakInside: 'avoid'}}>
          <thead>
            <tr>
              <th>Startnummer</th>
              <th>Name</th>
              <th>Klasse</th>
              <th>Jahrgang</th>
            </tr>
          </thead>
          <tbody>
            {clazz.map((student) =>
                <Student key={student.__id} student={student} />
            )}
          </tbody>
        </Table>
      )}
      </div>
    );
  }
}
