import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ReloadService } from '../../services/all';

@Component({
    selector: 'dataloader-header',
    template: require('./Header.html')
})
export class Header {
    constructor(reload: ReloadService, router: Router) {
        this.reload = reload;
        this.router = router;
    }

    load() {
        this.router.navigate(['/load']);
        this.reload.onNavigateToLoad();
    }
}
