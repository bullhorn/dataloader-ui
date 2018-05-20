// Angular
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
// Vendor
import { NovoElementProviders, NovoElementsModule } from 'novo-elements';
// App
// Components
import { AppComponent } from './app.component';
import { HeaderComponent } from './components/header/header.component';
import { LoadComponent } from './components/load/load.component';
import { ResultsComponent } from './components/results/results.component';
import { SettingsComponent } from './components/settings/settings.component';
import { RunComponent } from './components/run/run.component';
// Services
import { DataloaderService } from './providers/dataloader/dataloader.service';
import { ElectronService } from './providers/electron/electron.service';
import { FileService } from './providers/file/file.service';
// Pipes
import { AbbreviatedNumberPipe } from './pipes/abbreviated-number/abbreviated-number.pipe';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    LoadComponent,
    ResultsComponent,
    SettingsComponent,
    RunComponent,
    AbbreviatedNumberPipe,
  ],
  entryComponents: [SettingsComponent],
  imports: [
    // Angular
    BrowserAnimationsModule,
    BrowserModule,
    // Vendor
    NovoElementsModule,
    NovoElementProviders.forRoot(),
  ],
  providers: [DataloaderService, ElectronService, FileService],
  bootstrap: [AppComponent],
})
export class AppModule {}
