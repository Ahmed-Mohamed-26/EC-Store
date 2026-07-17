import { createReducer, on } from '@ngrx/store';
import { setLanguage } from './language.actions';

export interface LanguageState {
  lang: 'en' | 'ar';
}

export const initialLanguageState: LanguageState = {
  lang: 'en'
};

export const languageReducer = createReducer(
  initialLanguageState,
  on(setLanguage, (state, { lang }) => ({ ...state, lang }))
);
