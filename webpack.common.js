const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

const bundlePath = (ext) => pathData => pathData.chunk.name === "main" 
? `[name].[contenthash].bundle.${ext}` : `[name]/[name].[contenthash].bundle.${ext}`;

module.exports = {
 entry: {
  "main": "./src/index.js",
  "break-brick": "./src/brick-break/break-brick.js",
 },
 output: {
  filename: bundlePath("js"),
  path: path.resolve(__dirname, "dist"),
  clean: true
 },
 plugins: [
  new HtmlWebpackPlugin({
   template: "./src/index.html",
   inject: "body",
   chunks: ["main"],
   filename: "index.html"
  }),
  new HtmlWebpackPlugin({
   inject: "body",
   chunks: ["main"],
   template: "./src/error.html",
   filename: "error.html"
  }),
  new HtmlWebpackPlugin({
   inject: "body",
   template: "./src/brick-break/break-brick.html",
   chunks: ["main", "break-brick"],
   filename: "./break-brick/index.html"
  }),
  new MiniCssExtractPlugin({
   // Options similar to the same options in webpackOptions.output
   // both options are optional
   filename: bundlePath("css")
  })
 ],
 module: {
  rules: [
   {
    test: /\.html$/i,
    loader: "html-loader",
   },
   {
    test: /\.css$/i,
    use: [MiniCssExtractPlugin.loader, "css-loader"],
   },
   {
    test: /\.(png|svg|jpg|jpeg|gif)$/i,
    type: 'asset/resource',
   },
   {
    test: /\.(woff|woff2|eot|ttf|otf)$/i,
    type: 'asset/resource',
   }
  ]
 }
};