import 'zone.js';
import { bootstrapApplication } from '@angular/platform-browser';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { provideRouter, withHashLocation } from '@angular/router';  
import { App } from './app/app';
import { routes } from './app/app.routes';
bootstrapApplication(App, {
  providers: [
    provideHttpClient(withFetch()),
    provideRouter(routes) 
    
  ]
});
