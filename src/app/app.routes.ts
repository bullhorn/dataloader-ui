// Angular
import { Routes, RouterModule } from '@angular/router';
// App
import { AppComponent } from './app.component';
import { LoadComponent } from './components/load/load.component';
import { SettingsComponent } from './components/settings/settings.component';

export const routes: Routes = [
  {
    path: '',
    component: AppComponent,
    children: [
      { path: '', redirectTo: 'load', pathMatch: 'full' },
      { path: 'load', component: LoadComponent },
      { path: 'settings', component: SettingsComponent },
    ],
  },
];

export const routing: any = RouterModule.forRoot(routes);
