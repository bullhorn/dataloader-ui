// Angular
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
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
import { DropzoneComponent } from './components/dropzone/dropzone.component';
import { ElectronService } from './services/electron/electron.service';
import { FileService } from './services/file/file.service';
import { HeaderComponent } from './components/header/header.component';
import { InfoModalComponent } from './components/info-modal/info-modal.component';
import { LoadComponent } from './components/load/load.component';
import { MissingJavaModalComponent } from './components/missing-java-modal/missing-java-modal.component';
import { ResultsComponent } from './components/results/results.component';
import { RunComponent } from './components/run/run.component';
import { SettingsModalComponent } from './components/settings-modal/settings-modal.component';
import { StepComponent, StepperComponent } from './components/stepper/stepper.component';
import { StepHeaderComponent } from './components/stepper/step-header.component';
import { StepStatusComponent } from './components/stepper/step-status.component';

@NgModule({
  imports: [
    // Angular
    FormsModule,
    BrowserAnimationsModule,
    BrowserModule,
    // Vendor
    NovoElementsModule,
    NovoElementProviders.forRoot(),
  ],
  declarations: [
    AboutModalComponent,
    AppComponent,
    ConfirmModalComponent,
    DropzoneComponent,
    HeaderComponent,
    InfoModalComponent,
    LoadComponent,
    MissingJavaModalComponent,
    ResultsComponent,
    RunComponent,
    SettingsModalComponent,
    StepComponent,
    StepperComponent,
    StepHeaderComponent,
    StepStatusComponent,
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
