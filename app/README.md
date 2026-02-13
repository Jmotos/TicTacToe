# UI5 Application com.trifork.tictactoe

TicTacToe game built with SAPUI5 and CAP (Cloud Application Programming Model).

## Description

A complete TicTacToe game with:
- Player name validation
- Game state management
- OData V4 backend integration
- Unit tests with code coverage

## Requirements

Either [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/) for dependency management.

## Preparation

Use `npm` (or `yarn`) to install the dependencies:

```sh
npm install
```

(To use yarn, just do `yarn` instead.)

## Run the App

Execute the following command to run the app locally for development in watch mode (the browser reloads the app automatically when there are changes in the source code):

```sh
npm start
```

As shown in the terminal after executing this command, the app is then running on http://localhost:8080/index.html. A browser window with this URL should automatically open.

> **Note:** The backend CAP service must also be running on port 4004. Start it from the project root with `npm start`.

(When using yarn, do `yarn start` instead. Also for all commands below, you can just replace `npm` by `yarn` in this case.)

## Build the App

Execute the following command to build the project and get an app that can be deployed:

```sh
npm run build
```

The result is placed into the `dist` folder.

Note that `index.html` loads the UI5 framework from the relative URL `resources/...`, which does not physically exist, but is only provided dynamically by the UI5 tooling. For an actual deployment you should change this URL to either [the CDN](https://sdk.openui5.org/#/topic/2d3eb2f322ea4a82983c1c62a33ec4ae) or your local deployment of UI5.

## Test the App

### Run the Tests

To run all tests (lint + unit tests with coverage), do:

```sh
npm test
```

This includes linting and running the unit tests with code coverage. The test requires that no other process is using port 8080.

### Run Specific Tests Manually

You can manually open test pages by running `npm start` and then opening one of the following URLs in your browser:

- Unit tests: http://localhost:8080/test/Test.qunit.html?testsuite=test-resources/com/trifork/tictactoe/testsuite.qunit&test=unit/unitTests
- All tests: http://localhost:8080/test/testsuite.qunit.html
  

### Check the Code

To lint the code, do:

```sh
npm run lint
```