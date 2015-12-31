# fronen

> _From the spanish_ mijito haceme el fronen.

__fronen__ is the skeleton project I use for frontend development.

It uses npm for external dependencies, browserify to access them as modules,
stylus for the css and gulp to put it all together.

## How to Use

To test the building process: `npm run test-build`
To build the application: `npm run build`
To start the developement workflow: `npm run dev`

## Motivation

* The reusability of the current skeleton for as many frontend applications as posible.
* Trying to minimize the impact of changing a technology. Say Babel for PureScript or Stylus for Sass.
* Creating a Tested Building Process

## Stack

* Babel (ES2015 + JSX as default presets. _Easily modifiable via .babelrc_)
* Standard Linter on build
* Browserify to bundle with Watchify for faster builds
* npm as package manager
* Stylus
* Mocha for the building process tests

## The Gulpfile

There are 5 components in which gulp intervenes. Alas:

### Components

1. The [Babel | CoffeeScript] -> JS compilation (may include jsx)
2. The Stylus -> CSS compilation (may include Post CSS)
3. The [Jade] -> HTML code
4. The Assets
5. The Tests (may require compilation of the other components beforhand)

### Workflows / Processes

1. Development process. Needs on the fly compilation and testing, and a local server. Nice to have hot-swapping of code.
2. Building Process. Needs compilation, optimization (minification, image reduction) and testing on the built files.


#### TODO
- [x] make babel work
- [x] make browserify work with babel
- [ ]

### Changes
