import { fakeAsync, TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Action } from '@ngrx/store';
import { Observable, of, take } from 'rxjs';
import { createSpyFromClass, Spy } from 'jasmine-auto-spies';
import { GiffiesService } from 'src/app/services/giffies.service';
import { DEFAULT_ERROR_MESSAGE, GiffiesEffects } from './giffies.effects';
import { GiffiesActionsE } from '../actions/enums';
import { giffiesResponse, giffies } from 'src/app/mocks/giffies';
import { GiffiesResponseT } from 'src/app/services/types';
import { LocaleE, RatingE } from 'src/app/services/enums';

const FAKE_RES_ID = 'some random string';

const FAKE_QUERY = 'fake query';
const FAKE_LIMIT = 9; //per page according to the requirement
const FAKE_OFFSET = 0; //for pagination control
const FAKE_RATING = RatingE.G; //default rating, this can be changed if I want to extend the functionality to allow users select rating
const FAKE_LANG = LocaleE.EN; //default locale, this can be changed if I want to extend the functionality to allow users select locale

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

    // jasmine.DEFAULT_TIMEOUT_INTERVAL = 99999999
  });

  it('should trigger a saveGiffies action if it receives a positive response from getGeffies call', (done: DoneFn) => {
    const payload: GiffiesResponseT = {
      pagination: {
        offset: 0,
        total_count: [...giffiesResponse].length,
        count: FAKE_LIMIT,
      },
      data: [...giffiesResponse],
      meta: { msg: 'OK', status: 200, response_id: FAKE_RES_ID },
    };
    actions$ = of({
      type: GiffiesActionsE.GET_GIFFIES,
      payload: {
        query: FAKE_QUERY,
        limit: FAKE_LIMIT,
        offset: FAKE_OFFSET,
        rating: FAKE_RATING,
        lang: FAKE_LANG,
      },
    });
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

  it('should trigger a errorGiffies action with default error message if request from getGiffies is unsuccessful', (done: DoneFn) => {
    giffiesServiceSpy.getGiffies.and.throwWith('fake error');
    actions$ = of({
      type: GiffiesActionsE.GET_GIFFIES,
      payload: {
        query: FAKE_QUERY,
        limit: FAKE_LIMIT,
        offset: FAKE_OFFSET,
        rating: FAKE_RATING,
        lang: FAKE_LANG,
      },
    });

    effects.getGiffies$.pipe(take(1)).subscribe((action) => {
      expect(giffiesServiceSpy.getGiffies).toHaveBeenCalledTimes(1);
      expect(action).toEqual({
        type: GiffiesActionsE.ERROR_GIFFIES,
        message: DEFAULT_ERROR_MESSAGE,
      });
      done();
    });
  });
});
