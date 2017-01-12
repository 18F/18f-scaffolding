# The 18F Command

A set of command line utilities to standardize common functions here at 18F.

## Installation

```
curl -sO https://raw.githubusercontent.com/18f/18f-cli/release/install
bash ./install
```

If you'd like to keep a copy of the `git` repository around:

```
git clone https://github.com/18f/18f-cli/
cd 18f-cli
bash ./install
```

## Usage

```
18f [options] <subcommand> [subcommand options] <args>
```

### `18f init`

Turns the current directory into a `git` repo with proper `LICENSE.md`, `CONTRIBUTING.md`, `README.md`, and `.about.yml` files.

### `18f setup`

Runs the setup script found in https://github.com/18f/laptop. Used to set up a new computer or update an existing one. See that repo for more information about customizing the script through `~/.laptop.local`.

### `18f validate`

Checks a repo to see whether it has the standard 18F files, as created by `18f init`.

### `18f deploy`

Deploys a project to Cloud Foundry (and, more specifically, cloud.gov).

### `18f scan`

Allows a variety of pre-configured scans to be run on a project. Currently supports:
- Accessibility (§ 508)

### `18f brand`

Downloads the 18F brand assets, either in whole or in part. Useful as a periodic check to keep assets up-to-date.

### `18f upgrade`

Upgrade the `18f` command to the latest version

### Extra scripts

This repo also includes some scripts for standalone use, either in continuous integration services or on cloud.gov.
- `cf-db.sh`: get a `psql` binary for use on cloud.gov and connect to the database.
- `deploy.sh`: a deployment script for deploying from a continuous integration service

## Contributing

See [CONTRIBUTING](CONTRIBUTING.md) for additional information.

### Local development

This script is really a bundle of scripts: one main script and a bunch of subcommands. The main script—called `main`—looks for scripts named `18f-whatever` in `/usr/local/bin/` and makes them available as `18f whatever`.

New scripts should be added to this repository's `bin` folder without the `18f-` prefix, as that will be added during installation. They can be written in any language, but care should be taken to choose a language that most users will have. Similarly, there is a preference for avoiding additional dependencies in new scripts.

### Branch flow

- Main branch: `release`
- Development branch: `develop`

## Public domain

This project is in the worldwide [public domain](LICENSE.md). As stated in [CONTRIBUTING](CONTRIBUTING.md):

> This project is in the public domain within the United States, and copyright and related rights in the work worldwide are waived through the [CC0 1.0 Universal public domain dedication](https://creativecommons.org/publicdomain/zero/1.0/).
>
> All contributions to this project will be released under the CC0 dedication. By submitting a pull request, you are agreeing to comply with this waiver of copyright interest.

## Yeoman Scaffolding

In a parallel effort, we've introduced a few [Yeoman](http://yeoman.io/)
generators to accomplish similar tasks. To run them, you'll need Node.js, then
to install these generators (if this project proves useful, we'll create an
npm package for easier distribution).

```sh
cd /path/to/18f-cli   # navigate to project root
npm install -g yo     # install yeoman
npm install           # install the required libs
npm link              # install the 18f-cli generators globally
```

Then, run the generators:

```sh
cd /somewhere/else

yo 18f            # all generators
# or individually:
yo 18f:license
yo 18f:readme
```
