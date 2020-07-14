/* config-overrides.js */
const RelayCompilerWebpackPlugin = require("relay-compiler-webpack-plugin");
const path = require("path");

module.exports = function override(config, env) {
  config.plugins.push(
    new RelayCompilerWebpackPlugin({
      schema: path.resolve(__dirname, "../server/api.graphql"), // or schema.json
      extensions: ["ts", "tsx"],
      src: path.resolve(__dirname, "./src"),
    })
  );
  return config;
};
