import React from 'react';
import {QueryRenderer} from 'react-relay';
import environment from './environment'
import graphql from 'babel-plugin-relay/macro';
import Student from './Student'

export default class StudentList extends React.Component {
  render() {
    return (
      <div>
        {this.props.viewer.map(({student}) =>
            <Student key={student.__id} student={student} />
        )}
      </div>
    );
  }
}
