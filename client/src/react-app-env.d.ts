/// <reference types="react-scripts" />
/// <reference types="react-dom/next" />
/// <reference types="react/next" />

declare module "babel-plugin-relay/macro" {
  export { graphql as default } from "react-relay";
}
