// Angular
import { NgModule } from '@angular/core';
import { BrowserModule, Title } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
// Vendor
import { NovoElementProviders, NovoElementsModule } from 'novo-elements';
// App
import { AboutModalComponent } from './components/about-modal/about-modal.component';
import { AnalyticsService } from './providers/analytics/analytics.service';
import { AppComponent } from './app.component';
import { DataloaderService } from './providers/dataloader/dataloader.service';
import { ElectronService } from './providers/electron/electron.service';
import { InfoModalComponent } from './components/info-modal/info-modal.component';
import { FileService } from './providers/file/file.service';
import { HeaderComponent } from './components/header/header.component';
import { LoadComponent } from './components/load/load.component';
import { MissingJavaModalComponent } from './components/missing-java-modal/missing-java-modal.component';
import { ResultsComponent } from './components/results/results.component';
import { RunComponent } from './components/run/run.component';
import { SettingsModalComponent } from './components/settings-modal/settings-modal.component';

@NgModule({
  imports: [
    // Angular
    BrowserAnimationsModule,
    BrowserModule,
    // Vendor
    NovoElementsModule,
    NovoElementProviders.forRoot(),
  ],
  declarations: [
    AboutModalComponent,
    AppComponent,
    InfoModalComponent,
    HeaderComponent,
    LoadComponent,
    MissingJavaModalComponent,
    ResultsComponent,
    RunComponent,
    SettingsModalComponent,
  ],
  entryComponents: [
    AboutModalComponent,
    InfoModalComponent,
    MissingJavaModalComponent,
    SettingsModalComponent,
  ],
  providers: [
    AnalyticsService,
    DataloaderService,
    ElectronService,
    FileService,
    Title],
  bootstrap: [AppComponent],
})
export class AppModule {}
