import { Injectable, EventEmitter } from '@angular/core';

@Injectable()
export class ReloadService {
    openCleanLoadPage:EventEmitter = new EventEmitter();

    constructor() { }

    onNavigateToLoad() {
        this.openCleanLoadPage.emit();
    }

}
