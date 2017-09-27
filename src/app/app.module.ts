// Angular
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
// Vendor
import { NovoElementsModule, NovoElementProviders } from 'novo-elements';
// App
import { AppComponent } from './app.component';
import { routing } from './app.routes';
import { SettingsComponent } from './components/settings/settings.component';
import { HeaderComponent } from './components/header/header.component';
import { LoadComponent } from './components/load/load.component';
import { ElectronService } from './providers/electron.service';

@NgModule({
  declarations: [
    AppComponent,
    SettingsComponent,
    HeaderComponent,
    LoadComponent,
  ],
  imports: [
    // Angular
    BrowserModule,
    BrowserAnimationsModule,
    HttpModule,
    // Vendor
    NovoElementsModule,
    NovoElementProviders.forRoot(),
    // App
    routing,
  ],
  providers: [ElectronService],
  bootstrap: [AppComponent],
})
export class AppModule { }
