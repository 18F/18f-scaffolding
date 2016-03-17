# The 18F Command

A set of command line utilities to standardize common functions here at 18F.

## Installation

This set of scripts is designed to be used with [`groupthink`](https://github.com/DCgov/groupthink).

```bash
pip install groupthink
groupthink install 18f
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

## Contributing

See [CONTRIBUTING](CONTRIBUTING.md) for additional information.

### Branch flow

- Main branch: `release`
- Development branch: `develop`

## Public domain

This project is in the worldwide [public domain](LICENSE.md). As stated in [CONTRIBUTING](CONTRIBUTING.md):

> This project is in the public domain within the United States, and copyright and related rights in the work worldwide are waived through the [CC0 1.0 Universal public domain dedication](https://creativecommons.org/publicdomain/zero/1.0/).
>
> All contributions to this project will be released under the CC0 dedication. By submitting a pull request, you are agreeing to comply with this waiver of copyright interest.
