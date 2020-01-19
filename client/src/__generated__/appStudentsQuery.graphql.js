/**
 * @flow
 * @relayHash f5f424f93b81136ce8a21c17a8b04d67
 */

/* eslint-disable */

'use strict';

/*::
import type { ConcreteRequest } from 'relay-runtime';
export type appStudentsQueryVariables = {||};
export type appStudentsQueryResponse = {|
  +students: $ReadOnlyArray<{|
    +id: string
  |}>
|};
export type appStudentsQuery = {|
  variables: appStudentsQueryVariables,
  response: appStudentsQueryResponse,
|};
*/


/*
query appStudentsQuery {
  students {
    id
  }
}
*/

const node/*: ConcreteRequest*/ = (function(){
var v0 = [
  {
    "kind": "LinkedField",
    "alias": null,
    "name": "students",
    "storageKey": null,
    "args": null,
    "concreteType": "Student",
    "plural": true,
    "selections": [
      {
        "kind": "ScalarField",
        "alias": null,
        "name": "id",
        "args": null,
        "storageKey": null
      }
    ]
  }
];
return {
  "kind": "Request",
  "fragment": {
    "kind": "Fragment",
    "name": "appStudentsQuery",
    "type": "Query",
    "metadata": null,
    "argumentDefinitions": [],
    "selections": (v0/*: any*/)
  },
  "operation": {
    "kind": "Operation",
    "name": "appStudentsQuery",
    "argumentDefinitions": [],
    "selections": (v0/*: any*/)
  },
  "params": {
    "operationKind": "query",
    "name": "appStudentsQuery",
    "id": null,
    "text": "query appStudentsQuery {\n  students {\n    id\n  }\n}\n",
    "metadata": {}
  }
};
})();
// prettier-ignore
(node/*: any*/).hash = 'e042300c83a1edc46dd3d8b01f69065d';
module.exports = node;
