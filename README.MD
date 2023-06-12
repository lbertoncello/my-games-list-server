# ExpressJS Project

This is a boilerplate to start new [Node] + [ExpressJS] projects. It also comes with [ESLint] and [Prettier] configured and installed. Also, to be able to run automated tests, [Jest] also comes configured and installed. 

In addition, some utility entities and use cases, like `user`, `sign in`, `sign up` etc., are already pre-built using the [Repository Pattern] and implemented using [Mongoose] to connect with [MongoDB].

# Getting Started

## Before starting

This project uses [Husky] and [git-commit-msg-linter] to run some CI pipelines to ensure that only tested and standardized commits will be accepted. To install the CI pipelines, just run the following commands:

  ```
    yarn install
    yarn prepare
  ```

## Running Tests

To run the automated tests just run:

```
yarn test
```

To check the coverage of the tests, run

```
yarn test:ci
```
## Configuring the environment

To configure the environment create a file called `.env`. Fill it according to the content of the file `.env.example`. It is needed to have MongoDB running.

## Running the server

After installing the packages, configuring the environment and setting up MongoDB, to start the development server, just run:

```
yarn dev
```

In order to star the production server, run:

```
yarn start
```

## Routes

You can find the Postman documentation for the implemented routes in `express-base-api.postman-collection.json`.


  [Node]: <https://nodejs.org/en>
  [ExpressJS]: <https://expressjs.com/pt-br/>
  [Jest]: <https://jestjs.io/>
  [Repository Pattern]: <https://deviq.com/design-patterns/repository-pattern>
  [Mongoose]: <https://mongoosejs.com/>
  [MongoDB]: <https://www.mongodb.com/>
  [Husky]: <https://www.npmjs.com/package/husky>
  [git-commit-msg-linter]: <https://www.npmjs.com/package/git-commit-msg-linter>
  [ESLint]: <https://eslint.org/>
  [Prettier]: <https://prettier.io/>