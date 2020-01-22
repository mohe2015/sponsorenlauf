import React from 'react';
import {QueryRenderer} from 'react-relay';
import environment from './environment'
import graphql from 'babel-plugin-relay/macro';

export default class Me extends React.Component {
  render() {
    return (
      <QueryRenderer
        environment={environment}
        query={graphql`
          query MeQuery {
            me {
              id
              name
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
          return props.me.name;
        }}
      />
    );
  }
}
