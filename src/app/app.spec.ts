import { Component, provideZonelessChangeDetection } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideStore } from '@ngrx/store';
import { provideTranslateService } from '@ngx-translate/core';
import { BehaviorSubject, of } from 'rxjs';
import { App } from './app';
import { AuthService } from './services/auth-service';
import { LoaderService } from './services/loader-service';
import { Productservice } from './services/productservice';
import { languageReducer } from './store/lang/language.reducer';

@Component({
  template: '',
  standalone: true
})
class EmptyRouteComponent {}

describe('App', () => {
  const authMock = {
    user$: of(null),
    authInitialized$: of(true),
    isLoggedIn: () => false,
    isAdmin: () => false,
    logout: () => Promise.resolve()
  };

  const loaderMock = {
    show: () => undefined,
    hide: () => undefined
  };

  const productServiceMock = {
    wishlistCount$: new BehaviorSubject(0)
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [App],
      providers: [
        provideZonelessChangeDetection(),
        provideRouter([
          { path: 'Login', component: EmptyRouteComponent },
          { path: '**', component: EmptyRouteComponent }
        ]),
        provideStore({ language: languageReducer }),
        provideTranslateService(),
        { provide: AuthService, useValue: authMock },
        { provide: LoaderService, useValue: loaderMock },
        { provide: Productservice, useValue: productServiceMock }
      ]
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('should render the application shell', () => {
    const fixture = TestBed.createComponent(App);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('app-navbar')).toBeTruthy();
    expect(compiled.querySelector('router-outlet')).toBeTruthy();
    expect(compiled.querySelector('app-footer')).toBeTruthy();
  });
});
