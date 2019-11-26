![Data Loader Logo](dataloader.png)

An [Angular CLI](https://cli.angular.io/) / [Electron](https://electron.atom.io/) App that utilizes [Novo Elements](http://bullhorn.github.io/novo-elements/) to bring a rich user experience to Data Loader. Uses [Electron Builder](https://github.com/electron-userland/electron-builder) to package the Angular App inside of a Windows/Mac one-step installer that uses the latest [Bullhorn Data Loader](https://github.com/bullhorn/dataloader).

[![Build Status](https://travis-ci.com/bullhorn/dataloader-ui.svg?token=Ta7yXSf1ut1W7VuGXTKA&branch=master)](https://travis-ci.com/bullhorn/dataloader-ui)
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

### WebApp-only development server

Run `ng serve` for the Angular CLI dev server. Navigate to `http://localhost:4200/`. 
The app will automatically reload if you change any of the source files. 
The app will not have any Electron functionality, but is useful for developing the Angular App using fake data without having to wait for Electron.

### Notes on Setting up a Signed, Notarized Release for Windows/Mac

Electron Builder documentation on setting up code signing: https://www.electron.build/code-signing

##### Windows

1. 

##### Mac

1. In order to create a mac certificate, first request access to the Bullhorn Apple Developer account.

1. After a confirmation email you will have access with your bullhorn email as the user ID.

1. Create a **Mac Development Certificate** at: https://developer.apple.com/account/resources/certificates/list.

1. Download the certificate to your Mac's keychain.

1. From within Keychain Access, export the Mac Development Certificate using the .p12 file format.
   Set a strong password on the file, but don't use special characters in the password because
   “values are not escaped when your builds are executed”.

1. Encode the file to base64 (macOS: `base64 -i yourFile.p12 -o mac-certificate.txt`).

1. Do not commit the file `mac-certificate.txt` to source control!

1. Setup secure environment variables in Travis CI:
   
   - Set CSC_LINK to the contents of `mac-certificate.txt` by copying and pasting the very long one line string.
   
   - Set CSC_KEY_PASSWORD to the password you chose when generating the .p12 file.

1. Test locally by turning off application sharing on the certificate if it's on (defaults to off) and setting the CSC_LINK and CSC_KEY_PASSWORD
   environment variables before running `yarn package`. This way electron builder won't default to the certificate in your Mac's keychain.

1. Setup notarizing the mac app for distributing without virus scan warnings. This is required for Mac OSX Catalina and beyond in
   order to distribute outside of the app store. See official notarizing rules:
   https://developer.apple.com/documentation/xcode/notarizing_macos_software_before_distribution
   
1. Setup 2-factor authentication with developer.apple.com
   
1. Generate an App-specific password: https://support.apple.com/en-us/HT204397.
   
1. Setup secure environment variables in Travis CI:
   
   - Set APPLE_ID to you bullhorn apple developer email (your bullhorn email address)
   
   - Set APPLE_PASSWORD to the App-specific password you generated.
   
1. Test locally, by setting APPLE_ID / APPLE_PASSWORD environment variables on the command line and running `yarn package`

   - The notarize step can take several minutes while it uploads the package to Apple for verification using their automated virus scan.

