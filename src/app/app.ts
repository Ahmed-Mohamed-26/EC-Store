import { Component, HostBinding, OnInit, OnDestroy } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { Navbar } from "./componants/navbar/navbar";
import { Footer } from "./componants/footer/footer";
import { AuthService } from './services/auth-service';
import { Snackcomponent } from './componants/shardcomponents/snackcomponent/snackcomponent';
import { Store } from '@ngrx/store';
import { selectLang } from './store/lang/language.selectors';
import { Observable, Subscription } from 'rxjs';
import { LoaderComponent } from './componants/shardcomponents/loader-component/loader-component';
import { LoaderService } from './services/loader-service';



@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, Navbar, Footer, Snackcomponent, LoaderComponent],
  templateUrl: './app.html',
  styleUrls: ['./app.css']
})
export class App implements OnInit, OnDestroy{
  protected title = 'store';
  lang$: Observable<'en' | 'ar'>;
  lang: 'en' | 'ar' = 'en';
  private langSub: Subscription;
  private authSub?: Subscription; 


  constructor(private auth: AuthService, private router: Router, private store: Store, private loader: LoaderService) {
    this.lang$ = this.store.select(selectLang);
    this.langSub = this.lang$.subscribe(l => this.lang = l);
  }

 
  // ده هيضيف class 'rtl' للـ host (الـ app-root) لما اللغة عربي
  @HostBinding('class.rtl') get isRtl() { return this.lang === 'ar'; }


ngOnInit() {
 //avoid checking auth for /Payed route
  const currentHash = window.location.hash; 
  const currentPath = currentHash.substring(1) || '/'; 

  // check if the current path is /Payed
  if (currentPath.startsWith('/Payed') || currentPath === 'Payed') {
    this.loader.hide();
    return;
  }
// subscribe to auth changes
  this.authSub = this.auth.user$.subscribe(user => {
    const latestPath = this.router.url; 

    if (latestPath.includes('Payed')) {
      this.loader.hide();
      return;
    }
// redirect based on auth status and current path
    if (user && (latestPath === '/' || latestPath === '/Login' || latestPath === '/Register' || latestPath === '')) {
      this.router.navigate(['/Home']);
    } else if (!user && (latestPath === '/' || latestPath === '' || latestPath === '/Home' || latestPath.includes('/productDetails') || latestPath === '/Cart' || latestPath === '/Wishlist' || latestPath === '/About')) {
      this.router.navigate(['/Login']);
    }

    this.loader.hide();
  });
  // loader on route navigation

  this.router.events.subscribe(e => {
    if (e.constructor.name === 'NavigationStart') {
      this.loader.show();
    } else if (e.constructor.name === 'NavigationEnd' || e.constructor.name === 'NavigationCancel' || e.constructor.name === 'NavigationError') {
      this.loader.hide();
    }
  });
}

ngOnDestroy() {
  if (this.langSub) {
    this.langSub.unsubscribe();
  }
  if (this.authSub) {
    this.authSub.unsubscribe();
  }
}
}
