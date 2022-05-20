import { createSelector } from '@ngrx/store';
import { GiffiesState } from '../reducers/giffies.reducer';

export interface AppState {
  giffies: GiffiesState;
}

export const selectGiffies = (state: AppState) => state.giffies;

export const selectGiffiesCollection = createSelector(
  selectGiffies,
  (state: GiffiesState) => state.giffies
);

export const selectGiffiesPagination = createSelector(
  selectGiffies,
  (state: GiffiesState) => state.pagination
);
