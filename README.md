# Solary

> Web extension for french WebTV [Solary](https://www.solary.fr).

[![Build Status](https://travis-ci.org/Kocal-Web-Extensions/Solary.svg?branch=master)](https://travis-ci.org/Kocal-Web-Extensions/Solary)
[![Codecov](https://codecov.io/gh/Kocal-Web-Extensions/Solary/branch/1.6/graph/badge.svg)](https://codecov.io/gh/Kocal-Web-Extensions/Solary)
[![Maintainability](https://api.codeclimate.com/v1/badges/5cf66d0765fc3f806a25/maintainability)](https://codeclimate.com/github/Kocal-Web-Extensions/Solary/maintainability)
[![dependencies Status](https://david-dm.org/Kocal-Web-Extensions/Solary/status.svg)](https://david-dm.org/Kocal-Web-Extensions/Solary)
[![devDependencies Status](https://david-dm.org/Kocal-Web-Extensions/Solary/dev-status.svg)](https://david-dm.org/Kocal-Web-Extensions/Solary?type=dev)

---

- [Getting started](#getting-started)
  - [Requirements](#requirements)
  - [Bootstraping](#bootstraping)
  - [Commands](#commands)

## Getting started

### Requirements

- Node.js 9+
- [yarn](https://yarnpkg.com/lang/en/docs/install/)

### Bootstraping

Just run `yarn`.

### Commands

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
