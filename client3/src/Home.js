import React from 'react';
import { useLazyLoadQuery } from 'react-relay/hooks';
import graphql from "babel-plugin-relay/macro";

export function Home() {
  const data = useLazyLoadQuery(
    graphql`
query HomeQuery {
  me {
    id
    name
  }
}
    `
  )  

  return (
      <h1>{data.me.name}</h1>
  );
}
