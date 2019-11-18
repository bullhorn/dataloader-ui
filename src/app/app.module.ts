// Angular
import { NgModule } from '@angular/core';
import { BrowserModule, Title } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
// Vendor
import { NovoElementProviders, NovoElementsModule } from 'novo-elements';
// App
import { AboutModalComponent } from './components/about-modal/about-modal.component';
import { AnalyticsService } from './services/analytics/analytics.service';
import { AppComponent } from './app.component';
import { ConfirmModalComponent } from './components/confirm-modal/confirm-modal.component';
import { DataloaderService } from './services/dataloader/dataloader.service';
import { ElectronService } from './services/electron/electron.service';
import { FileService } from './services/file/file.service';
import { HeaderComponent } from './components/header/header.component';
import { InfoModalComponent } from './components/info-modal/info-modal.component';
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
    ConfirmModalComponent,
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
    ConfirmModalComponent,
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
