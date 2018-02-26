// NG
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
// Vendor
import { NovoElementProviders, NovoElementsModule } from 'novo-elements';
import { TranslateModule } from '@ngx-translate/core';
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
    TranslateModule.forRoot(),
    // Vendor
    NovoElementsModule,
    NovoElementProviders.forRoot(),
  ],
  providers: [DataloaderService, ElectronService, FileService],
  bootstrap: [AppComponent],
})
export class AppModule {}
