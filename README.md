# Solary

> Projects related to the french WebTV [Solary](https://www.solary.fr).

[![Travis](https://img.shields.io/travis/Kocal/Solary.svg?style=flat-square)](https://travis-ci.org/Kocal/Solary)
[![Codecov](https://img.shields.io/codecov/c/github/kocal/solary.svg?style=flat-square)](https://codecov.io/gh/Kocal/Solary)
[![Maintainability](https://api.codeclimate.com/v1/badges/a35582e96d89bace77b8/maintainability)](https://codeclimate.com/github/Kocal/Solary/maintainability)
[![DeepScan Grade](https://deepscan.io/api/projects/1639/branches/6092/badge/grade.svg)](https://deepscan.io/dashboard/#view=project&pid=1639&bid=6092)
[![dependencies Status](https://david-dm.org/kocal/solary/status.svg?style=flat-square)](https://david-dm.org/kocal/solary)
[![devDependencies Status](https://david-dm.org/kocal/solary/dev-status.svg?style=flat-square)](https://david-dm.org/kocal/solary?type=dev)

**Extension:**
[![dependencies Status](https://david-dm.org/kocal/solary/status.svg?style=flat-square&path=packages/extension)](https://david-dm.org/kocal/solary?path=packages/extension)
[![devDependencies Status](https://david-dm.org/kocal/solary/dev-status.svg?style=flat-square&path=packages/extension)](https://david-dm.org/kocal/solary?path=packages/extension&type=dev)

---

* [Getting started](#getting-started)
  * [Requirements](#requirements)
  * [Bootstraping](#bootstraping)
* [Projects](#projects)
  * [Extension](#extension)

## Getting started

### Requirements

* Node.js 9+
* [yarn](https://yarnpkg.com/lang/en/docs/install/)

### Bootstraping

Just run `lerna bootstrap`, it will install dependencies for all projects located inside `packages` folder.

## Projects

### Extension

All builds are located [here](https://solary.kocal.fr/builds) (if I think to put them here...).

* [Extension for Chrome](https://chrome.google.com/webstore/detail/solary/hcbdbiggklmbnbhhmepnebffpmajnkai)
* [Extension for Firefox](https://solary.kocal.fr/builds/firefox/)

#### Commands

##### `yarn build`

Build the extension for **production**, in folder `dist`.

##### `yarn build:dev`

Build the extension for **development**, in folder `dist`.

##### `yarn watch`

Watch any modifications and then run `yarn build`.

##### `yarn watch:dev`

Watch any modifications and then run `yarn build:dev`.

##### `yarn build-zip`

Generate a zip of the extension, e.g. `dist-zip/Solary-v1.X.X.zip`.
