import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import { FormTestComponent } from './app/form.test.component';

bootstrapApplication(FormTestComponent, appConfig).catch(err => console.error(err));
