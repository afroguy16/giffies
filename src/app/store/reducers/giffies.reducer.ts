import { createReducer, on } from '@ngrx/store';
import * as GiffiesActions from '../actions/giffies.actions';
import { PaginationT } from 'src/app/services/types';
import { GifT } from 'src/app/components/giffy/types';

export interface GiffiesState {
  pagination: PaginationT;
  giffies: GifT[];
}

const initialState: GiffiesState = {
  pagination: { offset: 0, total_count: 0, count: 0 },
  giffies: [],
};

export const giffiesReducer = createReducer(
  initialState,
  on(GiffiesActions.saveGiffies, (state, { payload }) => ({
    ...state,
    pagination: { ...payload.pagination },
    giffies: [...payload.data],
  }))
);
