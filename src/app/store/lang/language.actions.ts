import { createAction, props } from '@ngrx/store';

export const setLanguage = createAction(
  '[Language] Set Language',
  props<{ lang: 'en' | 'ar' }>()
);
