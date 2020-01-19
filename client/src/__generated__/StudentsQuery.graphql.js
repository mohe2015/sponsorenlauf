/**
 * @flow
 * @relayHash 97f07d8f1b3089350d702e967708cbfb
 */

/* eslint-disable */

'use strict';

/*::
import type { ConcreteRequest } from 'relay-runtime';
export type StudentsQueryVariables = {||};
export type StudentsQueryResponse = {|
  +students: $ReadOnlyArray<{|
    +id: string
  |}>
|};
export type StudentsQuery = {|
  variables: StudentsQueryVariables,
  response: StudentsQueryResponse,
|};
*/


/*
query StudentsQuery {
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
    "name": "StudentsQuery",
    "type": "Query",
    "metadata": null,
    "argumentDefinitions": [],
    "selections": (v0/*: any*/)
  },
  "operation": {
    "kind": "Operation",
    "name": "StudentsQuery",
    "argumentDefinitions": [],
    "selections": (v0/*: any*/)
  },
  "params": {
    "operationKind": "query",
    "name": "StudentsQuery",
    "id": null,
    "text": "query StudentsQuery {\n  students {\n    id\n  }\n}\n",
    "metadata": {}
  }
};
})();
// prettier-ignore
(node/*: any*/).hash = '416f0644787657eaf19150e8e0fc7396';
module.exports = node;
