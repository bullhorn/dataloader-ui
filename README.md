![DataLoader Logo](dataloader.png)

DataLoader **Desktop Application** Powered by the [Bullhorn DataLoader](https://github.com/bullhorn/dataloader). An Angular CLI App that utilizes [Novo Elements](http://bullhorn.github.io/novo-elements/) and [Electron](https://electron.atom.io/) to bring a rich user experience to DataLoader. 

## Quick Start

 1. Install Java if you don't have it already (you won't need the development kit) - [Windows](http://javadl.oracle.com/webapps/download/AutoDL?BundleId=210182) | [Mac](http://www.oracle.com/technetwork/java/javase/downloads/jdk8-downloads-2133151.html)
 
    1. Verify that you have the latest version of java on the command line by typing: `java -version`, which should show: `java version "1.8"`

 2. Download and run installer from the downloads section of the [Latest Release](https://github.com/bullhorn/dataloader/releases/latest)

## For Developers

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
|-- dataloader     - the latest downloaded DataLoader CLI
|-- dist           - where the Angular App gets built and the DataLoader CLI gets copied to
|-- main-process   - source files for the electron main process
    |-- main.ts    - the entry point for the main process that kicks off the electron renderer process in a new Browser Window
|-- packages       - where the electron app from the dist folder gets packaged into an os-specific installer by electron-builder
|-- src            - source files for the electron renderer process (the Angular front end)
    |-- main.ts    - the entry point for the renderer process that loads Angular
|-- userData       - mimics the actual user data of the installed app for use when running electron locally in dev mode
```

### Where files are located when installed on end user's machine

 * Application Data
   * DataLoader UI Angular App with Dependencies
   * DataLoader CLI Release Package
 * User Data
   * Output Files
     * Log Files
     * Results Files

### WebApp-only development server

Run `ng serve` for the Angular CLI dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files. The app will not have any Electron functionality, but can be useful for debugging the display and navigation.

#### Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

#### Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

#### Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).
