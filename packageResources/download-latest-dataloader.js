const fs = require('fs');
const request = require('request');
const extract = require('extract-zip');
const rimraf = require('rimraf');
const log = console.log;

const GH_TOKEN = process.env.GH_TOKEN;
const BASE_URL = `https://${GH_TOKEN}:@api.github.com/repos/bullhorn/dataloader`;
const FILE = 'dataloader.zip';

if (GH_TOKEN === undefined) {
  log(`ERROR: cannot download latest dataloader CLI release - missing 'GH_TOKEN' environment variable.`);
  process.exit();
}

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
    log(`ERROR: invalid or insufficient GH_TOKEN environment - cannot contact dataloader CLI repo.`);
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
