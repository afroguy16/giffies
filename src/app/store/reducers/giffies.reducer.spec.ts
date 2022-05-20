import * as fromRoot from './giffies.reducer';
import { saveGiffies } from '../actions/giffies.actions';
import { GiffiesResponseT } from 'src/app/services/types';
import { giffies } from 'src/app/mocks/giffies';

const COUNT = 9; //per page according to the requirement
const FAKE_PAGINATION = {
  offset: 0,
  total_count: [...giffies].length,
  count: COUNT,
};

describe('GiffiesReducers', () => {
  let initialState: fromRoot.GiffiesState;

  beforeEach(() => {
    initialState = {
      pagination: { offset: 0, total_count: 0, count: 0 },
      giffies: [],
    };
  });

  it('should return the same state value if an unknown action is called', () => {
    const action = {
      type: 'unknown',
    };

    const state = fromRoot.giffiesReducer(initialState, action);
    expect(state).toBe(initialState);
  });

  it('should set a new state with the payload once set giffies action is called', () => {
    const payload: Omit<GiffiesResponseT, 'meta'> = {
      pagination: FAKE_PAGINATION,
      data: [...giffies],
    };

    const action = saveGiffies({ payload });

    const state = fromRoot.giffiesReducer(initialState, action);

    expect(state.giffies).toEqual(giffies);
    expect(state.pagination).toEqual(FAKE_PAGINATION);
  });
});
