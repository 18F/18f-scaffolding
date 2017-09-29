# The 18F Generator

This project contains a set of [Yeoman](http://yeoman.io/) scaffolds to set up
common project needs. To run them, you'll either need
[Node.js](https://nodejs.org/en/download/) 6.x or
[Docker](docker.com/products/overview#install_the_platform)

## Install via Node

Once you have Node installed, you'll also need to install yeoman and this
package from the public NPM repository:

```sh
npm install -g yo               # install yeoman
npm install -g generator-18f    # installs this package
```

Then, run the generators:

```sh
cd /somewhere/else

yo 18f            # all generators
# or individually:
yo 18f:license
yo 18f:readme
yo 18f:gitignores
yo 18f:npm
yo 18f:cf-manifest
yo 18f:about-yml
yo 18f:newrelic
```

## Install via Docker

Once you have Docker installed, you'll want to run it with the current
directory mounted:

```sh
cd /somewhere/else

docker run --rm -it -v $PWD:/workdir 18fgsa/generator
```

That will run all of the generators. To run them individually, use e.g.

```sh
docker run --rm -it -v $PWD:/workdir --entrypoint yo 18fgsa/generator 18f:license
```

## Scaffolds

### License

Pulls file content from https://github.com/18F/open-source-policy

```sh
$ yo 18f:license
$ tree
.
├── CONTRIBUTING.md
└── LICENSE.md
```

### Readme

Pulls README content from
https://github.com/18F/open-source-policy/blob/master/README_TEMPLATE.md

```sh
$ yo 18f:readme
? What is the project's full name? My Project

$ tree
.
└── README.md
```

### Gitignores

Pulls Gitignore content from https://github.com/github/gitignore

```sh
$ yo 18f:readme
? What languages will this project use?
 ◯ Go
 ◉ Node
 ◯ Python
❯◉ Ruby

$ tree
.
└── .gitignore
```

### NPM

Creates a package.json file. Based on
https://github.com/caseywebb/generator-npm-init

```sh
$ yo 18f:npm
? Will this project have front end libraries/dependencies Yes
Configuring npm now...
? name: generator-18f
? version: 0.2.0
? description: Scaffolding for 18F projects
? main point: index.js
? test command: echo "Error: no test specified" && exit 1
? git repository: https://github.com/18F/18f-cli
? keywords (space-delimited):
? author: 18f
? license: CC0-1.0

$ tree
.
└── package.json
```

### Cloud.gov Manifests

Creates files for a cloud.gov deploy, depending on your primary application
language. Requires modification after generation.

```sh
$ yo 18f:cf-manifest
? What's the repo name? (A short name that acts as the project identifier) my-repo
? What is the primary language (for Travis, Cloud.gov, etc.)? (Use arrow keys)
❯ Go
  Node
  Python
  Ruby
? What is your application run command (e.g. "node app.js" or "gunicorn my_module.wsgi")? @TODO
? Will this project need any of these services?
❯◯ database
 ◯ secret credentials

$ tree
.
├── Procfile
├── TODO.txt
├── manifest_base.yml
├── manifest_dev.yml
└── manifest_prod.yml
```

### About.yml

Creates an .about.yml file (used in the ATO process).

```sh
$ yo 18f:about-yml
? What's the repo name? (A short name that acts as the project identifier) @TODO
? What's the project title? (A few words, title cased, describing the project) @TODO
? What is the problem your project solves? What is the solution? @TODO
? What is the measurable impact of your project? @TODO
? What is your project's current status? (Use arrow keys)
❯ discovery
  alpha
  beta
  live
? Will your project have automated tests? (Y/n)
? What type of content is being stored in the repo? (Use arrow keys)
❯ app
  docs
  policy
? What kind of group owns this repo? (Use arrow keys)
❯ project
  working-group
  guild
? Who is the primary partner for the project? (Use the full name documented here: https://github.com/18F/dashboard/blob/staging/_data/partners.yml ) @TODO
? Who is the primary team contact for the project? @TODO
? What is the primary team contact's email address? @TODO
? If this is a sub-repo of another repo, what is the name of that parent repo?  @TODO

$ tree
.
└── .about.yml
```

### New Relic

Generates a New Relic config files with 18F-recommended defaults.

```sh
$ yo 18f:newrelic
? What's the repo name? (A short name that acts as the project identifier) @TODO
? What is the primary language (for Travis, Cloud.gov, etc.)? (Use arrow keys)
❯ Go
  Node
  Python
  Ruby
? What languages will this project use?
 ◯ Go
 ◉ Node
 ◯ Python
❯◉ Ruby

$ tree
.
├── newrelic.ini
├── newrelic.js
└── newrelic.yml
```

## Local Development

You'll most likely want to `npm link` the in-progress project to add it to
make it visible to `yo`:

```sh
cd /path/to/18f-cli   # navigate to project root
npm install -g yo     # install yeoman
npm install           # install the required libs
npm link              # install the 18f-cli generators globally
```

## The 18F Command

This repository also contains an earlier effort to standardize common 18F
functions in the form of a set of command line utilities.

### Installation

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

### Usage

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

### Local development

This script is really a bundle of scripts: one main script and a bunch of subcommands. The main script—called `main`—looks for scripts named `18f-whatever` in `/usr/local/bin/` and makes them available as `18f whatever`.

New scripts should be added to this repository's `bin` folder without the `18f-` prefix, as that will be added during installation. They can be written in any language, but care should be taken to choose a language that most users will have. Similarly, there is a preference for avoiding additional dependencies in new scripts.

## Contributing

See [CONTRIBUTING](CONTRIBUTING.md) for additional information.


## Public domain

This project is in the worldwide [public domain](LICENSE.md). As stated in [CONTRIBUTING](CONTRIBUTING.md):

> This project is in the public domain within the United States, and copyright and related rights in the work worldwide are waived through the [CC0 1.0 Universal public domain dedication](https://creativecommons.org/publicdomain/zero/1.0/).
>
> All contributions to this project will be released under the CC0 dedication. By submitting a pull request, you are agreeing to comply with this waiver of copyright interest.

