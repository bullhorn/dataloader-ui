const { createWriteStream, existsSync } = require('fs');
const extract = require('extract-zip');
const rimraf = require('rimraf');

const BASE_URL = `https://api.github.com/repos/bullhorn/dataloader`;
const GH_TOKEN = process.env.GH_TOKEN;
const ZIP_FILE_NAME = 'dataloader.zip';

if (GH_TOKEN === undefined) {
  console.error(`ERROR: cannot download latest dataloader CLI release - missing 'GH_TOKEN' environment variable.`);
  process.exit();
}

async function download() {
  const headers = {
    'User-Agent': `Data Loader UI Downloader`,
    'Authorization': `Bearer ${GH_TOKEN}`,
  };
  const latest = await fetch(`${BASE_URL}/releases/latest`, { headers });

  console.log('checking version');
  const body = await latest.json();
  if (!body.tag_name) {
    console.error(`ERROR: invalid or insufficient GH_TOKEN environment - cannot contact dataloader CLI repo.`);
    process.exit();
  }

  const version = body.tag_name.slice(1); // `v1.2.3` minus the `v`
  if (existsSync(`dataloader/dataloader-${version}.jar`)) {
    console.log(`dataloader version: ${version} is up to date.`);
    process.exit();
  } else {
    rimraf.sync('./dataloader');
  }

  console.log(`downloading version: ${version}`);
  const assetID = body.assets.find((asset) => asset.name === ZIP_FILE_NAME).id;
  const response = await fetch(`${BASE_URL}/releases/assets/${assetID}`, {
    headers: {
      ...headers,
      Accept: 'application/octet-stream',
    }
  });
  const blob = await response.blob();
  const arrayBuffer = await blob.arrayBuffer();
  createWriteStream(ZIP_FILE_NAME).write(Buffer.from(arrayBuffer));

  console.log('extracting');
  await extract(ZIP_FILE_NAME, { dir: process.cwd() });
  console.log('deleting zip file');
  rimraf.sync(ZIP_FILE_NAME);
}

download();
