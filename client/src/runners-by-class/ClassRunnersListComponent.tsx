import React from "react";
import { useLazyLoadQuery, usePaginationFragment } from 'react-relay/hooks';
import graphql from "babel-plugin-relay/macro";
import { ClassRunnerRow } from './ClassRunnerRow'
import { unstable_useTransition as useTransition } from 'react';
import LoadingButton from '@material-ui/lab/LoadingButton';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import { ClassRunnersListComponentRunnersByClassQuery } from "../__generated__/ClassRunnersListComponentRunnersByClassQuery.graphql";

export function ClassRunnersListComponent() {
  const [startTransition, isPending] = useTransition({ timeoutMs: 3000 });

  const data = useLazyLoadQuery<ClassRunnersListComponentRunnersByClassQuery>(
    graphql`
      query ClassRunnersListComponentRunnersByClassQuery {
        runnersByClass {
          class
          runners {
            id
            ...ClassRunnerRow_runner
          }
        }
      }
    `,
    {},
    {
      fetchPolicy: "store-or-network",
      networkCacheConfig: {
        force: false
      }
  })

  return (<>
    {(data.runners?.edges ?? []).map(edge => {
      const node = edge!.node;
      return (
        <ClassRunnerRow key={node.id} runner={node} />
      );
    })}
  </>
  );
}