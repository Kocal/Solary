# Solary

> Extension web pour la Web TV [Solary](https://www.solary.fr).

![Test](https://github.com/Kocal/Solary/workflows/Test/badge.svg)

---

- [Getting started](#getting-started)
  - [Requirements](#requirements)
  - [Bootstraping](#bootstraping)
  - [Commands](#commands)

## Getting started

### Requirements

- Node.js 10+
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
