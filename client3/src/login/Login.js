import React from 'react';
import { graphql, useRelayEnvironment, useMutation } from 'react-relay/hooks';
import { useState, useCallback } from 'react';

const LoginMutation = graphql`
mutation LoginMutation($username: String!, $password: String!) {
  login(name: $username, password: $password) {
    token
    user {
      id
    }
  }
}
`;

export function Login(props) {
  const [isLoginPending, login] = useMutation(LoginMutation);

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const onSubmit = useCallback(
    event => {
      event.preventDefault();

      login({
        variables: {
          username,
          password
        }
      })
    },
    [username, password]
  );

    return (
      <form onSubmit={onSubmit}>

        <input type="text" />
        <input type="password" />

        <button type="submit">Anemlden</button>
      
      </form>

    )
}