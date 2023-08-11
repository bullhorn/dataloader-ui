# Bullhorn Data Loader Desktop App

[![Build Status](https://travis-ci.com/bullhorn/dataloader-ui.svg?token=Ta7yXSf1ut1W7VuGXTKA&branch=master)](https://travis-ci.com/bullhorn/dataloader-ui)
[![Conventional Commits](https://img.shields.io/badge/Conventional%20Commits-1.0.0-yellow.svg)](https://conventionalcommits.org)

An [Angular CLI](https://cli.angular.io/) / [Electron](https://electron.atom.io/) App that utilizes [Novo Elements](http://bullhorn.github.io/novo-elements/) to bring a rich user experience to Data Loader. Uses [Electron Builder](https://github.com/electron-userland/electron-builder) to package the Angular App inside of a Windows/Mac one-step installer that uses the latest [Bullhorn Data Loader](https://github.com/bullhorn/dataloader).

### Development vs Deployment

This repo contains the Desktop App source code and developer documentation.

Installers are published to the [Data Loader App](https://github.com/bullhorn/dataloader-app) repo
which contains the installers and user facing documentation.
The windows/mac installer files are published there along with additional files that enable auto-updates using electron-updater.

### Prerequisites

 * Node 18
 * Yarn (latest)
 * Setup GitHub token for API access to dataloader repo for automatic downloads
   * Create GitHub personal access token: [Personal access tokens](https://github.com/settings/tokens)
   * Generate new token
   * Select just the first box, `repo` access - _Full control of private repos_
   * Assign token value to a new `GH_TOKEN` environment variable on your machine

### Quick Start

```
# Clone the project
git clone git@github.com:bullhorn/dataloader-ui.git

# Change directory
cd dataloader-ui

# Install
yarn

# Launch electron app locally in dev mode
yarn start
```

### Make distributable executable

```
# Generate installers for Windows and Mac (not bothering with Linux for now)
yarn package
```

### Project structure

```
|-- buildResources     - image files used in creating the distributable electron-builder installer
|-- dataloader         - the latest downloaded Data Loader CLI
|-- dist               - where the Angular App gets built and the Data Loader CLI gets copied to
|-- mainProcess        - source files for the electron main process
    |-- mainProcess.ts - the entry point for the main process that kicks off the electron renderer process in a new Browser Window
|-- packageResources   - files required to package the app for distribution as a Windows/Mac App from a certified developer
|-- packages           - where the electron app from the dist folder gets packaged into an os-specific installer by electron-builder
|-- src                - source files for the electron renderer process (the Angular front end)
    |-- main.ts        - the entry point for the renderer process that loads Angular
|-- userData           - mimics the actual user data of the installed app for use when running electron locally in dev mode
```

### Where files are located when installed on end user's machine

 * Application Data
   * Data Loader UI Angular App with Dependencies
   * Data Loader CLI Release Package
 * User Data
   * Output Files
     * Log Files
     * Results Files

### How to triage the packaged application

`electron-log` is used to log debug messages and errors that occur in the main process.
The main process is responsible for opening the application window and also for spawning
off the Data Loader CLI for doing the actual work. Check out the
[electron-log documentation](https://www.npmjs.com/package/electron-log) for more information.

### WebApp-only development server

Run `yarn test` for the Angular CLI dev server. Navigate to `http://localhost:4200/`. 
The app will automatically reload if you change any of the source files. 
The app will not have any Electron functionality, but is useful for developing the Angular App using fake data without having to wait for Electron.

### Creating a Release

See the **[RELEASE.md](RELEASE.md)** file
