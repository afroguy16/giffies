import { createAction, props } from '@ngrx/store';
import { RequestPayloadT } from 'src/app/services/types';
import { GiffiesActionsE } from './enums';
import { SaveGiffiesPayloadT } from './types';

export const getGiffies = createAction(
  GiffiesActionsE.GET_GIFFIES,
  props<{ payload: RequestPayloadT }>()
);
export const saveGiffies = createAction(
  GiffiesActionsE.SAVE_GIFFIES,
  props<{ payload: SaveGiffiesPayloadT }>()
);
export const errorGiffies = createAction(
  GiffiesActionsE.ERROR_GIFFIES,
  props<{ message: string }>()
);
