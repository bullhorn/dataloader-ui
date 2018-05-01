// Angular
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
// Vendor
import { NovoElementProviders, NovoElementsModule } from 'novo-elements';
// App
import { AppComponent } from './app.component';
import { DataloaderService } from './providers/dataloader/dataloader.service';
import { ElectronService } from './providers/electron/electron.service';
import { FileService } from './providers/file/file.service';
import { HeaderComponent } from './components/header/header.component';
import { LoadComponent } from './components/load/load.component';
import { ResultsComponent } from './components/results/results.component';
import { routing } from './app.routes';
import { SettingsComponent } from './components/settings/settings.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    LoadComponent,
    ResultsComponent,
    SettingsComponent,
  ],
  imports: [
    // Angular
    BrowserAnimationsModule,
    BrowserModule,
    HttpModule,
    // Vendor
    NovoElementsModule,
    NovoElementProviders.forRoot(),
    // App
    routing,
  ],
  providers: [DataloaderService, ElectronService, FileService],
  bootstrap: [AppComponent],
})
export class AppModule {}
