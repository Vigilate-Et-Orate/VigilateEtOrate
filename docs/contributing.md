# Contribution guidelines

Thank you to take time for our project !

## Local dev

If not installed, please follow the [local development](./local-development.md) guidelines to install the project on your local environment.

> Reminder: Ubuntu dev env is prefered

## General Rules

- All new code is pushed on a new branch (see below) and when it needs to be merged to develop, goes thew a **Pull Request**. *Commits on develop will be rejected and reverted!!*
- Code need to be tested : see the [testing](./testing.md) guidelines
- Run the `yarn run lint` tool to check errors.
- Run the `yarn run format` tool to beautify your code. It will be run as a pre-commit hook.

## Branches

Use gitflow for branch managment.
> Installation `sudo apt install git-flow`

Branch type | gitflow prefix
---|---
Feature | feat/
Bugfix | fix/
Release | release/

Other are default, using master and develop. 

Once you have finished your work, push to github and __open a PR__ (Pull Request).