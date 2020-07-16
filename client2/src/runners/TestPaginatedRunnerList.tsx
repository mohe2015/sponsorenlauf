import React from 'react';
import { graphql } from "babel-plugin-relay/macro";
import {createPaginationContainer} from 'react-relay';
import Runner from './Runner';

interface RunnerType {
  clazz: string;
  grade: number;
  id: string;
  name: string;
  startNumber: number;
}

type Props = {
  list: any;
  relay: any;
}

type State = {
}

class TestPaginatedRunnerList extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)

    this.state = {
      
    }
  }

  nextPage = () => {
    console.log("loadmore: ", this.props.relay.loadMore(5, (error?: Error) => {
      console.log("FETCHED NEW DATA!!!", error);
    }))
  }

  render() {
    return (
      <table>
      <tbody>
        {this.props.list.runners.edges.map((runner: any) => runner.node)
          .map((row: RunnerType, index: number) => {
            
            return (
              <Runner key={row.id} runner={row} handleClick={() => {}} />
            );
          })}
      </tbody>
      </table>
    );
  }
}

export default createPaginationContainer(TestPaginatedRunnerList, {
  list: graphql`
    fragment TestPaginatedRunnerList_list on Query
    @argumentDefinitions(
      count: {type: "Int", defaultValue: 5}
      cursor: {type: "String"}
    ) {
      runners(first: $count, after: $cursor) @connection(key: "Runner_runners") {
        edges {
          node {
            id
            ...Runner_runner
          }
        }
        totalCount
      }
    }
  `,
}, {
  direction: 'forward',
  getConnectionFromProps(props: Props) {
    console.log("getConnectionFromProps: ", props)
    return props.list && props.list.runners;
  },
  getFragmentVariables(prevVars, totalCount) {
    return {
      ...prevVars,
      count: totalCount,
    };
  },
  getVariables(props, {count, cursor}, fragmentVariables) {
    return {
      count,
      cursor,
    };
  },
  query: graphql`
    # Pagination query to be fetched upon calling 'loadMore'.
    # Notice that we re-use our fragment, and the shape of this query matches our fragment spec.
    query TestPaginatedRunnerListQuery (
      $count: Int!
      $cursor: String
    ) {
        ...TestPaginatedRunnerList_list @arguments(count: $count, cursor: $cursor)
    }
  `
});
