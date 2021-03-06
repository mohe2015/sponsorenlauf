module.exports = {
  src: "./src",
  schema: "../server/schema.graphql",
  exclude: ["**/node_modules/**", "**/__mocks__/**", "**/__generated__/**"],
  language: "typescript",
  artifactDirectory: "./src/__generated__",
  extensions: ["js", "ts", "tsx"],
  customScalars: { DateTime: "String" },
};
