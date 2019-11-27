let fs = require('fs');
let request = require('request');
let extract = require('extract-zip');
let rimraf = require('rimraf');
let log = console.log;

const BASE_URL = `http://api.github.com/repos/bullhorn/dataloader`;
const FILE = 'dataloader.zip';

let latestReleaseAssets = {
  url: `${BASE_URL}/releases/latest`,
  headers: {
    'User-Agent': 'Data Loader UI Downloader',
  }
};

request(latestReleaseAssets, (error, response, bodyString) => {
  error ? log(error) : log('checking version...');

  let body = JSON.parse(bodyString);
  if (!body.tag_name) {
    log(`ERROR: something went wrong - cannot contact dataloader repo.`);
    process.exit();
  }

  let version = body.tag_name.slice(1); // `v1.2.3` minus the `v`
  if (fs.existsSync(`dataloader/dataloader-${version}.jar`)) {
    log(`dataloader version: ${version} is up to date.`);
    process.exit();
  } else {
    log(`downloading version: ${version}...`);
    rimraf.sync('./dataloader');
  }

  let assetID = body.assets.find((asset) => asset.name === FILE).id;
  let downloadDataLoaderZip = {
    url: `${BASE_URL}/releases/assets/${assetID}`,
    headers: {
      'Accept': 'application/octet-stream',
      'User-Agent': 'Data Loader UI Downloader',
    },
    encoding: null // we want a buffer and not a string
  };

  request.get(downloadDataLoaderZip)
    .pipe(fs.createWriteStream(FILE)
      .on('finish', () => {
        log('extracting...');
        extract(FILE, { dir: process.cwd() }, (error) => {
          error ? log(error) : log('deleting zip file...');
          fs.unlinkSync(FILE);
          log('done');
        });
      }));
});
