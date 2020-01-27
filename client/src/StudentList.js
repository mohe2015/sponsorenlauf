import React from 'react';
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
    let dict = this.groupBy(this.props.viewer, 'class')
    return (
      <div>
      {
      Object.keys(dict).map(clazzName =>
        <Table bordered hover variant="sm" style={{pageBreakInside: 'avoid'}}>
          <thead>
            <tr>
              <th>Startnummer ({clazzName})</th>
              <th>Name</th>
              <th>Jahrgang</th>
            </tr>
          </thead>
          <tbody>
            {dict[clazzName].map((student) =>
                <Student key={student.__id} student={student} />
            )}
          </tbody>
        </Table>
      )}
      </div>
    );
  }
}
