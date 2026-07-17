import { Component, OnInit } from '@angular/core';
import { Router, RouterLink,RouterLinkActive } from '@angular/router';
import { AuthService } from '../../services/auth-service';

import { NgIf, CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { selectLang } from '../../store/lang/language.selectors';
import { setLanguage } from '../../store/lang/language.actions';
import { User } from '@angular/fire/auth';
import { Productservice } from '../../services/productservice';

@Component({
  selector: 'app-navbar',
   standalone: true,
  imports: [RouterLink,RouterLinkActive,CommonModule,NgIf,TranslateModule],
  templateUrl: './navbar.html',
  styleUrls: ['./navbar.css']
})
export class Navbar implements OnInit {
  user$: any;
  
  user: User | null = null;
  // user$: any;
  lang$: Observable<'en' | 'ar'>;
  currentLang: 'en' | 'ar' = 'en';
  wishlistCount$: Observable<number>;

  constructor(
    public auth: AuthService,
    private router: Router,
    private store: Store,
    private productService: Productservice
  ) {
        this.lang$ = this.store.select(selectLang);
        this.lang$.subscribe(lang => {
          this.currentLang = lang;
        });
        this.user$ = this.auth.user$;
        this.wishlistCount$ = this.productService.wishlistCount$;
  }
  

 ngOnInit() {
    this.auth.user$.subscribe(user => {
      this.user = user;
    });
  }

  isLoggedIn() {
    return this.auth.isLoggedIn();
  }

  logout() {
    this.auth.logout().then(() => {
      this.router.navigate(['/Login']); 
    });
  }

  isAdmin() { return this.auth.isAdmin(); }

   changeLang(lang: 'en' | 'ar') {
    this.store.dispatch(setLanguage({ lang }));
  }

  toggleLang() {
    this.changeLang(this.currentLang === 'en' ? 'ar' : 'en');
  }


}
