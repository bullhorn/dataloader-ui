// NG
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import { HttpClient, HttpClientModule } from '@angular/common/http';
// Vendor
import { NovoElementProviders, NovoElementsModule } from 'novo-elements';
import { TranslateLoader, TranslateModule, TranslateService } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
// App
import { AppComponent } from './app.component';
import { DataloaderService } from './providers/dataloader/dataloader.service';
import { ElectronService } from './providers/electron/electron.service';
import { FileService } from './providers/file/file.service';
import { HeaderComponent } from './components/header/header.component';
import { LoadComponent } from './components/load/load.component';
import { ResultsComponent } from './components/results/results.component';
import { SettingsComponent } from './components/settings/settings.component';
import { RunListComponent } from './components/run-list/run-list.component';
import { RunTileComponent } from './components/run-tile/run-tile.component';

export function createTranslateLoader(http: HttpClient): TranslateHttpLoader {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    LoadComponent,
    ResultsComponent,
    SettingsComponent,
    RunListComponent,
    RunTileComponent,
  ],
  imports: [
    // NG
    BrowserAnimationsModule,
    BrowserModule,
    HttpModule,
    HttpClientModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: (createTranslateLoader),
        deps: [HttpClient],
      },
    }),
    // Vendor
    NovoElementsModule,
    NovoElementProviders.forRoot(),
  ],
  providers: [DataloaderService, ElectronService, FileService],
  bootstrap: [AppComponent],
})
export class AppModule {
  constructor(translate: TranslateService) {
    // Default to English if current language isn't found
    translate.setDefaultLang('en');
  }
}
