import { createAction, props } from '@ngrx/store';
import { GiffiesActionsE } from './enums';
import { SaveGiffiesPayloadT } from './types';

export const getGiffies = createAction(
  GiffiesActionsE.GET_GIFFIES,
  props<{ payload: string }>()
);
export const saveGiffies = createAction(
  GiffiesActionsE.SAVE_GIFFIES,
  props<{ payload: SaveGiffiesPayloadT }>()
);
