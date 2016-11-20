// NG2
import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
// Vendor
import { NovoElementsModule, NovoToastModule } from 'novo-elements';
// APP
import { DataloaderUI } from './app/DataloaderUI';
import './dataloader-ui.module.scss';
// providers: [
//     ...APP_PROVIDERS
// ],


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
        NovoToastModule
    ],
    entryComponents: [
        DataloaderUI
    ],
    bootstrap: [DataloaderUI]
})
export class DataloaderUIModule {
}
