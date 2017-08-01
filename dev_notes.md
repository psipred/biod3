# Preamble
Consider reading:
https://medium.com/javascript-scene/the-rise-and-fall-and-rise-of-functional-programming-composable-software-c2d91b424c8c

# Dev guide

1. starting a new node project

$ mkdir project
$ cd project/
$ npm init -y

We make a new project directory and then instantiate a new package.json to
describe the ES2017 dependencies

2. Configure the dev packages for our repo

$ npm install "babel-core@^6" "babel-loader@^6" "babel-preset-es2017@^6" "babel-preset-stage-0@^6" "webpack@^2" "webpack-dev-server@^2" css-loader style-loader json-loader --save-dev

babel-code : core transpiler for ESX to browser friendly js
babel-loader: module loading for webpack server
babel-preset-es2017 : es2017 compatibility for babel-core
babel-preset-stage: additional compatibility and polyfils for babel
webpack : Module bundle, bundle JavaScript files for usage in a browser
webpack is a module bundler. Its main purpose is to bundle JavaScript files for usage in a browser
webpack-dev-server : live reloading mini webserver for watching code as you change it
css-loader : webpack css module bundler
style-loader : webpack style module loader for css-loader
json-loader : json module loader for webpack

This is a good selection of things for developing modern js. In the future you can now
take the package.json and reinstall everything with:

$ npm install

3. biod3 is a d3 project so we can install that with

$ npm install d3 --save

4. Edit pacakge.json to add a descrption of the project and provide a sane
version number

5. Configure webpack
This tells webpack where to find your code, which is the base stub and which
bits to transpile and bundle

$ touch webpack.config.js
$ vi webpack.config.js

Then add:
```
/**
 * This is the Webpack configuration file. Webpack is used both as a task runner
 * and also a module bundler. This is why we can use snazzy NodeJS-style `require`
 * statements and also ES6 module definitions.
 */

const path = require('path');

module.exports = [
{
  // name: 'client',
  entry: {
    app: ['./lib/main.js'], // This is the main file that gets loaded first; the "bootstrap", if you will.
  },
  output: { // Transpiled and bundled output gets put in `build/bundle.js`.
    path: path.resolve(__dirname, 'build'),
    publicPath: '/assets/', // But it gets served as "assets" for testing purposes.
    filename: 'bundle.js',   // Really, you want to upload index.html and assets/bundle.js
  },

  // This makes it easier to debug scripts by listing line number of whichever file
  // threw the exception or console.log or whathaveyounot.
  devtool: 'inline-source-map',

  module: {
    loaders: [
      {
        test: /\.js?$/, // Another convention is to use the .es6 filetype, but you then
                        // have to supply that explicitly in import statements, which isn't cool.
        exclude: /(node_modules|bower_components)/,
        loader: 'babel-loader',
      },
      // This nifty bit of magic right here allows us to load entire JSON files
      // synchronously using `require`, just like in NodeJS.
      {
        test: /\.json$/,
        loader: 'json-loader',
      },
      // This allows you to `require` CSS files.
      // We be in JavaScript land here, baby! No <style> tags for us!
      {
        test: /\.css$/,
        loader: 'style-loader!css-loader',
      },
    ],
  },
},
{
  // name: 'server',
  entry: {
    app: ['./lib/server.js'], // This is the main file that gets loaded first; the "bootstrap", if you will.
  },
  target: 'node',

  output: { // Transpiled and bundled output gets put in `build/server.bundle.js`.
    path: path.resolve(__dirname, 'build'),
    filename: 'server.bundle.js',
  },

  externals: {
    canvas: 'commonjs canvas'
  },

  devtool: 'inline-source-map',

  module: {
    loaders: [
      {
        test: /\.js?$/, // Another convention is to use the .es6 filetype, but you then
                        // have to supply that explicitly in import statements, which isn't cool.
        exclude: /(node_modules|bower_components)/,
        loader: 'babel-loader',
      },
      // This nifty bit of magic right here allows us to load entire JSON files
      // synchronously using `require`, just like in NodeJS.
      {
        test: /\.json$/,
        loader: 'json-loader',
      },
    ],
  },
}];
```

6. Update the  /package.json to configure babel add these 3 entries after "name"
```
"babel": {
    "presets": [
      "es2017",
     ]
  },
  "main": "lib/main.js",
  "scripts": {
    "start": "webpack-dev-server --inline",
  },
```

7. make an html stub we can use to view what we're doing

$ touch index.html.

```
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <title>Holder</title>
  </head>
  <body>
    <script src="assets/bundle.js"></script>
  </body>
</html>

```

8. make the javascript head stub

$ mkdir lib
$ touch lib/main.js

9. make the css head stub

$ mkdir styles
$ touch styles/index.css

10. start the webpack server to start development

$ npm start
