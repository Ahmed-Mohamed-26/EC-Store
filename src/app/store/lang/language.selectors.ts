import { createFeatureSelector, createSelector } from '@ngrx/store';
import { LanguageState } from './language.reducer';

export const selectLanguageFeature = createFeatureSelector<LanguageState>('language');

export const selectLang = createSelector(
  selectLanguageFeature,
  (state) => state.lang
);
