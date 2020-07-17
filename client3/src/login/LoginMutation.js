import { graphql, useRelayEnvironment } from 'react-relay/hooks';

const login = graphql`
mutation LoginMutation($username: String!, $password: String!) {
  login(name: $username, password: $password) {
    token
    user {
      id
    }
  }
}
`;