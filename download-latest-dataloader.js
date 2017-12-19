let request = require('request');
let fs = require('fs');
let extract = require('extract-zip');
let log = console.log;

const TOKEN = '47728eb9ca3a3043ac064927cd8cb51c35f260a2';
const BASE_URL = `https://${TOKEN}:@api.github.com/repos/bullhorn/dataloader`;
const FILE = 'dataloader.zip';

let latestReleaseAssets = {
  url: `${BASE_URL}/releases/latest`,
  headers: {
    'User-Agent': 'DataLoader UI Downloader',
  }
};

request(latestReleaseAssets, (error, response, bodyString) => {
  error ? log(error) : log('downloading...');

  let body = JSON.parse(bodyString);
  let assetID = body.assets.find((asset) => asset.name === FILE).id;
  let downloadDataLoaderZip = {
    url: `${BASE_URL}/releases/assets/${assetID}`,
    headers: {
      'Accept': 'application/octet-stream',
      'User-Agent': 'DataLoader UI Downloader',
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
