# The 18F Command

This is a command line utility to standardize common functions here at 18F. It can be extended by putting any command with the format `18f-yourcommand` on your `PATH`.

## Installation

```bash
git clone git@github.com:18F/18f-cli.git
cd 18f-cli
make install
```

## Usage

```
18f [options] <subcommand> [subcommand options] <args>
```

### Built-in commands

`18f init` will turn the current directory into a `git` repo with proper `LICENSE.md`, `CONTRIBUTING.md`, `README.md`, and `.about.yml` files.

## Public domain

This project is in the worldwide [public domain](LICENSE.md). As stated in [CONTRIBUTING](CONTRIBUTING.md):

> This project is in the public domain within the United States, and copyright and related rights in the work worldwide are waived through the [CC0 1.0 Universal public domain dedication](https://creativecommons.org/publicdomain/zero/1.0/).
>
> All contributions to this project will be released under the CC0 dedication. By submitting a pull request, you are agreeing to comply with this waiver of copyright interest.
