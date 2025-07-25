import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import { FormTestComponent } from './app/form.test.component';
import { GridComponent } from './app/grid.component';
import { QueueComponent } from './queue/queue.component';

bootstrapApplication(QueueComponent, appConfig).catch(err => console.error(err));
