// NG2
import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
// Vendor
import { NovoElementsModule, NovoElementProviders, FormUtils } from 'novo-elements';
// APP
import { DataloaderUI } from './app/DataloaderUI';
import './dataloader-ui.module.scss';
import { ComponentsModule } from './components/components.module.js';

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
        ComponentsModule
    ],
    providers: [
        FormUtils
    ],
    entryComponents: [
        DataloaderUI
    ],
    bootstrap: [DataloaderUI]
})
export class DataloaderUIModule {
}
