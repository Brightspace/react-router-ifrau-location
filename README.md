# react-router-ifrau-location

[![NPM version][npm-image]][npm-url]
[![Build status][ci-image]][ci-url]
[![Coverage Status][coverage-image]][coverage-url]
[![Dependency Status][dependencies-image]][dependencies-url]

This component helps with routing within a [React](http://facebook.github.io/react/) `IFRAME`-based free-range app using [react-router](https://github.com/rackt/react-router). It leverages a [custom location](http://rackt.github.io/react-router/#Custom Location) object to keep the outer page's URL in sync as the user interacts with your application within the `IFRAME`.

## Motivation

With `IFRAME`-based free-range applications, the entire application is contained inside an `IFRAME`, hosted within a page in Brightspace. As the user interacts with the application, the application has no way of accessing or manipulating the outer page's URL. As such, back/forward typically have no effect, and bookmarking often won't return the user to the same point within the application's workflow.

`react-router-ifrau-location` solves this by communicating with the host page using [ifrau](https://github.com/Brightspace/ifrau). It keeps the outer page's URL in sync with your application's URL, and vice versa when the user manipulates their browser history (back/forward).

## Installation

Install from NPM:

```shell
npm install react-router-ifrau-location
```

## Usage

Typically when using [react-router](https://github.com/rackt/react-router), your application calls `Router.run`, passing its routes and a handler:

```javascript
var Router = require('react-router');
var routes = ...; // application routes

Router.run(routes, function(Handler) {
  // render your application
});
```

There's an optional second `location` argument, that when specified will be responsible for providing and managing the application's URL. By default, react-router ships with a few location implementations you can choose from: `HashLocation` (default), `HistoryLocation` (uses the HTML5 history API to make the URLs look friendly), `RefreshLocation` (always reloads the page), and so on.

`react-router-ifrau-location` is a custom implementation of a react-router location. You must provide it with an ifrau client, which it will use to communicate with the host page to get/set the URL for your application.

```javascript
var Client = require('ifrau').Client,
	iFrauLocation = require('react-router-ifrau-location'),
	Main = require('main.jsx'),
	Path1 = require('path1.jsx'),
	Path2 = require('path2.jsx'),
	Router = require('react-router');

var routes = (
	<Router.Route handler={Main} path="/d2l/path/to/your/application/">
		<Router.DefaultRoute handler={Path1} />
		<Router.Route name="path1" handler={Path1} />
		<Router.Route name="path2" handler={Path2} />
	</Router.Route>
);

var client = new Client();
client.connect().then(function() {
	var location = new iFrauLocation(client);
	Router.run(routes, location, function(Handler) {
		// render your application
	});
})
```

That's it!

## Contributing

Contributions are welcome!

1. **Fork** the repository. Committing directly against this repository is
   highly discouraged.
2. Make your modifications in a branch, updating and writing new unit tests
   as necessary in the `test` directory.
3. Ensure that all tests pass with `npm test`
4. `rebase` your changes against master. *Do not merge*.
5. Submit a pull request to this repository. Wait for tests to run and someone to chime in.

### Code Style

This repository is configured with [EditorConfig](http://editorconfig.org) rules and contributions should make use of them.

[npm-url]: https://www.npmjs.org/package/react-router-ifrau-location
[npm-image]: https://img.shields.io/npm/v/react-router-ifrau-location.svg
[ci-url]: https://travis-ci.org/Brightspace/react-router-ifrau-location
[ci-image]: https://img.shields.io/travis/Brightspace/react-router-ifrau-location.svg
[coverage-url]: https://coveralls.io/r/Brightspace/react-router-ifrau-location?branch=master
[coverage-image]: https://img.shields.io/coveralls/Brightspace/react-router-ifrau-location.svg
[dependencies-url]: https://david-dm.org/Brightspace/react-router-ifrau-location
[dependencies-image]: https://img.shields.io/david/Brightspace/react-router-ifrau-location.svg
