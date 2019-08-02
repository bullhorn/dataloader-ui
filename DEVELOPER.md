![Data Loader Logo](dataloader.png)

An [Angular CLI](https://cli.angular.io/) / [Electron](https://electron.atom.io/) App that utilizes [Novo Elements](http://bullhorn.github.io/novo-elements/) to bring a rich user experience to Data Loader. Uses [Electron Builder](https://github.com/electron-userland/electron-builder) to package the Angular App inside of a Windows/Mac one-step installer that uses the latest [Bullhorn Data Loader](https://github.com/bullhorn/dataloader).

[![Build Status](https://travis-ci.com/bullhorn/dataloader-ui.svg?token=Ta7yXSf1ut1W7VuGXTKA&branch=master)](https://travis-ci.com/bullhorn/dataloader-ui)
[![Coverage Status](https://coveralls.io/repos/github/bullhorn/dataloader-ui/badge.svg?branch=master&t=gVrMsY)](https://coveralls.io/github/bullhorn/dataloader-ui?branch=master)
[![Conventional Commits](https://img.shields.io/badge/Conventional%20Commits-1.0.0-yellow.svg)](https://conventionalcommits.org)

## For Developers

### Setup GitHub Token for API access to dataloader private repo

 1. Create GitHub Personal access token: [Personal access tokens](https://github.com/settings/tokens)

    1. Generate new token
    
    2. Select just the first box, `repo` access - _Full control of private repos_
 
 2. Assign token value to a new `GH_TOKEN` environment variable on your machine

### Quick Start

```
# Clone the project
git clone git@github.com:bullhorn/dataloader-ui.git

# Change directory
cd dataloader-ui

# Install
npm install

# Launch electron app locally in dev mode
npm start
```

### Make distributable executable

```
# Generate installers for Windows and Mac (not bothering with Linux for now)
npm run package
```

### Project structure

```
|-- buildResources - image files used in creating the distributable electron-builder package
|-- dataloader     - the latest downloaded Data Loader CLI
|-- dist           - where the Angular App gets built and the Data Loader CLI gets copied to
|-- main-process   - source files for the electron main process
    |-- main.ts    - the entry point for the main process that kicks off the electron renderer process in a new Browser Window
|-- packages       - where the electron app from the dist folder gets packaged into an os-specific installer by electron-builder
|-- src            - source files for the electron renderer process (the Angular front end)
    |-- main.ts    - the entry point for the renderer process that loads Angular
|-- userData       - mimics the actual user data of the installed app for use when running electron locally in dev mode
```

### Where files are located when installed on end user's machine

 * Application Data
   * Data Loader UI Angular App with Dependencies
   * Data Loader CLI Release Package
 * User Data
   * Output Files
     * Log Files
     * Results Files

### WebApp-only development server

Run `ng serve` for the Angular CLI dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files. The app will not have any Electron functionality, but is useful for developing the Angular App using fake data without having to wait for Electron.

#### Running unit tests

Run `npm test` to execute the unit tests via [Karma](https://karma-runner.github.io).

#### Note on updating package.json

The `package-lock.json` file is used by Travis CI to build the same exact version of dependencies that was used during development. The use of the [Bullhorn Internal Artifactory](https://artifactory.bullhorn.com) will break the use of `package-lock.json` by Travis CI. Prior to doing an `npm install`, make sure to switch back to the public npm repo: 

  ```
  nrm use npm
  ```
