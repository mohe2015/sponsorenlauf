import React from "react";
import { QueryRenderer } from "react-relay";
import graphql from "babel-plugin-relay/macro";
import environment from "../environment";
import Student from "./Student";
import { Table } from "react-bootstrap";

export default class StudentList extends React.Component {
  groupBy = function(xs, key) {
    return xs.reduce(function(rv, x) {
      (rv[x[key]] = rv[x[key]] || []).push(x);
      return rv;
    }, {});
  };

  values = dictionary => {
    return Object.keys(dictionary).map(function(key) {
      return dictionary[key];
    });
  };

  render() {
    return (
      <QueryRenderer
        environment={environment}
        query={graphql`
          query StudentListQuery {
            students {
              #edges {
              #node {
              startNumber
              class
              ...Student_student
              #},
              #},
            }
          }
        `}
        variables={{}}
        render={({ error, props }) => {
          if (error) {
            return <div>Error!</div>;
          }
          if (!props) {
            return <div>Loading...</div>;
          }
          let dict = this.groupBy(props.students, "class");
          return (
            <div>
              {Object.keys(dict).map(clazzName => (
                <Table
                  key={clazzName}
                  bordered
                  hover
                  variant="sm"
                  style={{ pageBreakInside: "avoid" }}
                >
                  <thead>
                    <tr>
                      <th>Startnummer ({clazzName})</th>
                      <th>Name</th>
                      <th>Jahrgang</th>
                    </tr>
                  </thead>
                  <tbody>
                    {dict[clazzName].map(student => (
                      <Student key={student.startNumber} student={student} />
                    ))}
                  </tbody>
                </Table>
              ))}
            </div>
          );
        }}
      />
    );
  }
}
