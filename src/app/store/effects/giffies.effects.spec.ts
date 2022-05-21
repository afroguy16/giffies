import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Action } from '@ngrx/store';
import { Observable, of, take } from 'rxjs';
import { createSpyFromClass, Spy } from 'jasmine-auto-spies';
import { GiffiesService } from 'src/app/services/giffies.service';
import { GiffiesEffects } from './giffies.effects';
import { GiffiesActionsE } from '../actions/enums';
import { giffiesResponse, giffies } from 'src/app/mocks/giffies';
import { GiffiesResponseT } from 'src/app/services/types';

const COUNT = 9; //per page according to the requirement
const FAKE_RES_ID = 'some random string';

describe('GiffiesEffects', () => {
  let actions$ = new Observable<Action>();
  let giffiesServiceSpy: Spy<GiffiesService>;
  let effects: GiffiesEffects;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        GiffiesEffects,
        provideMockActions(() => actions$),
        {
          provide: GiffiesService,
          useValue: createSpyFromClass(GiffiesService),
        },
      ],
    });

    giffiesServiceSpy = TestBed.inject<any>(GiffiesService);
    effects = TestBed.inject(GiffiesEffects);
  });

  it('should trigger a saveGiffies action if it receives a positive response from getGeffies call', (done: DoneFn) => {
    const payload: GiffiesResponseT = {
      pagination: {
        offset: 0,
        total_count: [...giffiesResponse].length,
        count: COUNT,
      },
      data: [...giffiesResponse],
      meta: { msg: 'OK', status: 200, response_id: FAKE_RES_ID },
    };
    actions$ = of({ type: GiffiesActionsE.GET_GIFFIES });
    giffiesServiceSpy.getGiffies.and.returnValue(of(payload));

    const { pagination } = payload;

    const extractedPayload = { pagination, data: [...giffies] };

    effects.getGiffies$.pipe(take(1)).subscribe((action) => {
      expect(giffiesServiceSpy.getGiffies).toHaveBeenCalledTimes(1);
      expect(action).toEqual({
        type: GiffiesActionsE.SAVE_GIFFIES,
        payload: extractedPayload,
      });
      done();
    });
  });
});
