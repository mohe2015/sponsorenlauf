import React from 'react';
import { useLazyLoadQuery } from 'react-relay/hooks';
import graphql from "babel-plugin-relay/macro";
import { UsersList } from './users/UsersList'
import { RunnersList } from './runners/RunnersList'
import Checkbox from '@material-ui/core/Checkbox';
import { unstable_useTransition as useTransition } from 'react';

export function Home() {
  const [checked, setChecked] = React.useState(true);
  const [startTransition, isPending] = useTransition({ timeoutMs: 30000 });

  return (<>
      <Checkbox
        checked={checked}
        onChange={(event) => startTransition(() => {
          setChecked(event.target.checked)
        })}
        inputProps={{ 'aria-label': 'primary checkbox' }}
      />
      {checked ? <UsersList /> : <RunnersList />}
    </>
  );
}
