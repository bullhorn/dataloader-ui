// Required to satisfy Typescript not knowing about the Electron provided 'window.require'
interface Window {
  require: any;
}
