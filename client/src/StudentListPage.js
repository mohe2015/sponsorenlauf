import React, { Component } from 'react';
import {QueryRenderer} from 'react-relay';
import environment from './environment'
import graphql from 'babel-plugin-relay/macro';
import StudentList from './StudentList';

class StudentListPage extends Component {

    render() {
      return (
        <QueryRenderer
            environment={environment}
            query={graphql`
            query StudentsQuery {
                students {
                    id
                    startNumber
                    name
                    class
                    grade
                }
            }
            `}
            variables={{}}
            render={({error, props}) => {
            if (error) {
                return <div>{error.message}</div>;
            }
            if (!props) {
                return <div>Loading...</div>;
            }
            return (
                <StudentList viewer={props.students} />
            );
            }}
        />
      )
    }
  }
  
  export default StudentListPage