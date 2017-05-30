// NG2
import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import {APP_BASE_HREF} from '@angular/common';
import { Routes, RouterModule, PreloadAllModules, ActivatedRouteSnapshot } from '@angular/router';

// Vendor
import { NovoElementsModule, NovoElementProviders, FormUtils } from 'novo-elements';
// APP
import { DataloaderUI } from './app/DataloaderUI';
import './dataloader-ui.module.scss';
import { ComponentsModule } from './components/components.module';
import { Settings, Load } from './components/all';

export const routes = [
    { path: '', redirectTo: '/load', pathMatch: 'full' },
    { path: 'load', component: Load },
    { path: 'settings', component: Settings }
];

@NgModule({
    declarations: [
        DataloaderUI
    ],
    imports: [
        BrowserModule,
        FormsModule,
        ReactiveFormsModule,
        HttpModule,
        NovoElementsModule,
        NovoElementProviders.forRoot(),
        ComponentsModule,
        RouterModule.forRoot(routes, { useHash: true })
    ],
    providers: [
        { provide: APP_BASE_HREF, useValue : '' },
        FormUtils
    ],
    entryComponents: [
        DataloaderUI
    ],
    bootstrap: [DataloaderUI]
})
export class DataloaderUIModule {
}
