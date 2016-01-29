# The 18F Command

This is a command line utility to standardize common functions here at 18F. It can be extended by putting any command with the format `18f-yourcommand` on your `PATH`.

## Installation

To set a different name for the central command created, create an `orgname` file with that string.

```bash
git clone git@github.com:18F/18f-cli.git
cd 18f-cli
git checkout release
echo YOURORG > orgname # optional
make install
```

## Usage

```
18f [options] <subcommand> [subcommand options] <args>
```

### `18f init`

Turns the current directory into a `git` repo with proper `LICENSE.md`, `CONTRIBUTING.md`, `README.md`, and `.about.yml` files.

### `18f setup`

Runs the setup script found in https://github.com/18f/laptop. Used to set up a new computer or update an existing one. See that repo for more information about customizing the script through `~/.laptop.local`.

## Public domain

This project is in the worldwide [public domain](LICENSE.md). As stated in [CONTRIBUTING](CONTRIBUTING.md):

> This project is in the public domain within the United States, and copyright and related rights in the work worldwide are waived through the [CC0 1.0 Universal public domain dedication](https://creativecommons.org/publicdomain/zero/1.0/).
>
> All contributions to this project will be released under the CC0 dedication. By submitting a pull request, you are agreeing to comply with this waiver of copyright interest.
