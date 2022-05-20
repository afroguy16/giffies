import { createAction, props } from '@ngrx/store';
import { GiffiesResponseT } from 'src/app/services/types';
import { GiffiesActionsE } from './enums';

export const getGiffies = createAction(
  GiffiesActionsE.GET_GIFFIES,
  props<{ payload: string }>()
);
export const saveGiffies = createAction(
  GiffiesActionsE.SAVE_GIFFIES,
  props<{ payload: Omit<GiffiesResponseT, 'meta'> }>()
);
