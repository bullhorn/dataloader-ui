import { Component } from '@angular/core';

@Component({
    selector: 'dataloader-ui',
    template: require('./DataloaderUI.html')
})
export class DataloaderUI {
    constructor() {
        this.app = 'Dataloader';
    }
}
