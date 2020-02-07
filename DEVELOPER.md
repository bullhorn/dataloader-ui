![Data Loader Logo](dataloader.png)

An [Angular CLI](https://cli.angular.io/) / [Electron](https://electron.atom.io/) App that utilizes [Novo Elements](http://bullhorn.github.io/novo-elements/) to bring a rich user experience to Data Loader. Uses [Electron Builder](https://github.com/electron-userland/electron-builder) to package the Angular App inside of a Windows/Mac one-step installer that uses the latest [Bullhorn Data Loader](https://github.com/bullhorn/dataloader).

[![Build Status](https://travis-ci.com/bullhorn/dataloader-ui.svg?token=Ta7yXSf1ut1W7VuGXTKA&branch=master)](https://travis-ci.com/bullhorn/dataloader-ui)
[![Conventional Commits](https://img.shields.io/badge/Conventional%20Commits-1.0.0-yellow.svg)](https://conventionalcommits.org)

## For Developers

TODO: Move this to the regular readme - move the readme to dataloader-app

### Setup GitHub Token for API access to dataloader repo for automatic downloads

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

1. In Jira, put in an SE ticket request for a Microsoft Authenticode certificate from Digicert.

2. Save the certificate in the .p12 file format?????

3. Encode the file to base64 (macOS: `base64 -i yourFile.p12 -o win-certificate.txt`).

4. Do not commit the file `win-certificate.txt` to source control!

5. Setup Code Signing Certificate (CSC) secure environment variables in Travis CI, available only to `master` branch, so no other branches can sign/publish:
   
   - Set WIN_CSC_LINK to the contents of `win-certificate.txt` by copying and pasting the very long one line string.
   
   - Set WIN_CSC_KEY_PASSWORD to the password you chose when generating the .p12 file.


##### Mac

1. In order to create a mac certificate, first request access to the Bullhorn Apple Developer account.

2. After a confirmation email you will have access using your bullhorn email address as the user ID.

3. Create a **Mac Developer ID Application Certificate** at: https://developer.apple.com/account/resources/certificates/list.
   This require the highest level of admin rights that cannot be assigned to a developer. Someone from IT will need to generate
   the certificate while signed into developer.apple.com from your mac.

4. Download the generated certificate to your Mac's keychain.

5. From within Keychain Access, export the Mac Development Certificate using the .p12 file format.
   Set a strong password on the file, but don't use special characters in the password because
   “values are not escaped when your builds are executed”.

6. Encode the file to base64 (macOS: `base64 -i yourFile.p12 -o mac-certificate.txt`).

7. Do not commit the file `mac-certificate.txt` to source control!

8. Setup Code Signing Certificate (CSC) secure environment variables in Travis CI, available only to `master` branch, so no other branches can sign/publish:
   
   - Set CSC_LINK to the contents of `mac-certificate.txt` by copying and pasting the very long one line string.
   
   - Set CSC_KEY_PASSWORD to the password you chose when generating the .p12 file.

9. Test locally by setting the CSC_LINK and CSC_KEY_PASSWORD environment variables before running `yarn package`.

10. Setup notarizing the mac app for distributing without virus scan warnings. This is required for Mac OSX Catalina and beyond in
    order to distribute outside of the app store. See official notarizing rules:
    https://developer.apple.com/documentation/xcode/notarizing_macos_software_before_distribution
   
11. Setup 2-factor authentication with developer.apple.com
   
12. Generate an App-specific password: https://support.apple.com/en-us/HT204397.
   
13. Setup APPLE account secure environment variables in Travis CI, available to all branches right now,
    until the afterSign hook knows if signing happened: https://github.com/electron-userland/electron-builder/issues/4452.
   
   - Set APPLE_ID to you bullhorn apple developer email (your bullhorn email address)
   
   - Set APPLE_PASSWORD to the App-specific password you generated.
   
14. Test locally, by setting APPLE_ID / APPLE_PASSWORD environment variables on the command line and running `yarn package`

   - The notarize step can take several minutes while it uploads the package to Apple for verification using their automated virus scan.
