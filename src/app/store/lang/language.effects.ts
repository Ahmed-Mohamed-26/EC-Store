
import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType, ROOT_EFFECTS_INIT } from '@ngrx/effects';
import { setLanguage } from './language.actions';
import { map, tap } from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';

@Injectable()
export class LanguageEffects {

  private actions$ = inject(Actions);
  private translate = inject(TranslateService);

  // يبدأ عند تشغيل التطبيق
  initLanguage$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ROOT_EFFECTS_INIT),
      map(() => {
        const stored = localStorage.getItem('lang') as 'en' | 'ar' | null;
        return setLanguage({ lang: stored ?? 'en' });
      })
    )
  );

  // عند تغيير اللغة
  applyLang$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(setLanguage),
        tap(({ lang }) => {
          localStorage.setItem('lang', lang);

          document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
          document.documentElement.lang = lang;

          this.translate.use(lang);
        })
      ),
    { dispatch: false }
  );
}

