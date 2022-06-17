##### Data Loader Developer Documentation

### Standard Commit Messages on Master

Commits to master use the [Conventional Commits Specification](https://conventionalcommits.org/). Admins select the _Squash and Merge_ option when merging in Pull Requests and rename the commit to follow the format: _type_(_scope_): _description_. 

__Examples:__ 

`feat(Settings): Added setting 'xyz'`

`fix(Load): fixed xyz`

`feat(Settings): BREAKING CHANGE: New major release`

`chore(cleanup): cleaned up xyz`

### Creating a Release

[standard-version](https://www.npmjs.com/package/standard-version) is used to calculate the version number based on the standard commits on master since the last tagged version. Provide a specific number instead to bypass the calculated version.

 1. Checkout master
  
 2. Run release script: `npm run release`. This will create a new commit and push to master. 

 3. Wait for all Travis CI builds to complete. Once finished, it will create the draft release and attach installers.

 4. Copy generated release notes from `CHANGELOG.md` to the release draft and publish release.
    
    NOTE: In GitHub, the last release that you touch in any way (like adding release notes) gets the "Latest release" tag.
    Auto-updates will not work if the last version published does not have this tag, so make sure that older releases
    don't accidentally get this by re-editing the latest release.

 5. Update the [Data Loader App README](https://github.com/bullhorn/dataloader-app/blob/master/README.md)
    download links with the new release version.

### Notes on Setting up a Signed, Notarized Release for Windows/Mac

Electron Builder documentation on setting up code signing: https://www.electron.build/code-signing

##### Windows

1. In Jira, put in an SE ticket request for a Microsoft Authenticode certificate from Digicert.

2. Save the certificate in the .p12 file format

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
