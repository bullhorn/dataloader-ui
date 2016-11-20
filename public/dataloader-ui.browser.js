// NG2
import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
// APP
import { DataloaderUIModule } from './dataloader-ui.module.js';

// Enable prod mode
if (ENV === 'production') {
    enableProdMode();
}

/**
 * Bootstrap via function to ensure DOM is ready
 */
export function main() {
    platformBrowserDynamic().bootstrapModule(DataloaderUIModule);
}

/**
 * Bootstrap
 */
export function bootstrapDomReady() {
    document.addEventListener('DOMContentLoaded', main);
}
bootstrapDomReady();
