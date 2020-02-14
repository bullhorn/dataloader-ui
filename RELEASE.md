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

 3. Wait for the Travis CI build to complete. Once finished, it will create the draft release and attach installers.

 4. Copy generated release notes from `CHANGELOG.md` to the release draft and publish release.
    
    NOTE: In GitHub, the last release that you touch in any way (like adding release notes) gets the "Latest release" tag.
    Auto-updates will not work if the last version published does not have this tag, so make sure that older releases
    don't accidentally get this by re-editing the latest release.
