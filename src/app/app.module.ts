// Angular
import { BrowserModule, Title } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
// Vendor
import { NovoElementProviders, NovoElementsModule } from 'novo-elements';
// App
import { AppComponent } from './app.component';
import { DataloaderService } from './providers/dataloader/dataloader.service';
import { ElectronService } from './providers/electron/electron.service';
import { ErrorModalComponent } from './components/error-modal/error-modal.component';
import { FileService } from './providers/file/file.service';
import { HeaderComponent } from './components/header/header.component';
import { LoadComponent } from './components/load/load.component';
import { ResultsComponent } from './components/results/results.component';
import { RunComponent } from './components/run/run.component';
import { SettingsComponent } from './components/settings/settings.component';
import { UpdateModalComponent } from './components/update-modal/update-modal.component';

@NgModule({
  declarations: [
    AppComponent,
    ErrorModalComponent,
    HeaderComponent,
    LoadComponent,
    ResultsComponent,
    RunComponent,
    SettingsComponent,
    UpdateModalComponent,
  ],
  entryComponents: [
    ErrorModalComponent,
    SettingsComponent,
    UpdateModalComponent,
  ],
  imports: [
    // Angular
    BrowserAnimationsModule,
    BrowserModule,
    // Vendor
    NovoElementsModule,
    NovoElementProviders.forRoot(),
  ],
  providers: [
    DataloaderService,
    ElectronService,
    FileService,
    Title],
  bootstrap: [AppComponent],
})
export class AppModule {}
