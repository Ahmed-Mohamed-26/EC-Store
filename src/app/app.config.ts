import {
  ApplicationConfig,
  provideBrowserGlobalErrorListeners,
  provideZonelessChangeDetection,
} from '@angular/core';
import { provideRouter, withHashLocation, withEnabledBlockingInitialNavigation } from '@angular/router';
import { routes } from './app.routes';
import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { provideAuth, getAuth } from '@angular/fire/auth';
import {  provideHttpClient, withInterceptors } from '@angular/common/http';
////ngrx
import { provideStore } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { languageReducer } from './store/lang/language.reducer';
import { LanguageEffects } from './store/lang/language.effects';
// ngx-translate
import { provideTranslateService } from '@ngx-translate/core';
import { provideTranslateHttpLoader } from '@ngx-translate/http-loader';
import { loaderInterceptor } from './interceptors/loader.interceptor';

function initDir() {
  return () => {
    const lang = (localStorage.getItem('lang') as 'en' | 'ar') ?? 'en';
    document.documentElement.setAttribute('dir', lang === 'ar' ? 'rtl' : 'ltr');
    document.documentElement.setAttribute('lang', lang);
  };
}

export const appConfig: ApplicationConfig = {
   providers: [
  
provideHttpClient(
  withInterceptors([loaderInterceptor])
),    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),
    // provideRouter(routes),
    provideRouter(
      routes,
      withHashLocation(),
      withEnabledBlockingInitialNavigation()
    ),

    // NgRx Store + Effects
    provideStore({ language: languageReducer }),
    provideEffects([LanguageEffects]),

 // ngx-translate v15+
    provideTranslateService({
      loader: provideTranslateHttpLoader({
        prefix: './assets/i18n/',
        suffix: '.json'
      })
    }),

  

    provideFirebaseApp(() =>
      initializeApp({
        apiKey: 'AIzaSyCysmz8qNkkT_5TLDqbPZU0dOiXcoqn8lM',
        authDomain: 'store-59dfa.firebaseapp.com',
        projectId: 'store-59dfa',
        storageBucket: 'store-59dfa.firebasestorage.app',
        messagingSenderId: '464359551870',
        appId: '1:464359551870:web:c3bad7f5e3fa1b3e62b92f',
        measurementId: 'G-W36WW7KXKT',
      })
    ),
    provideAuth(() => getAuth()),
  ],
};


