import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { EMPTY } from 'rxjs';
import { map, switchMap, catchError } from 'rxjs/operators';
import { GiffiesService } from 'src/app/services/giffies.service';
import { GiffiesActionsE } from '../actions/enums';

@Injectable()
export class GiffiesEffects {
  getGiffies$ = createEffect(() =>
    this.actions$.pipe(
      ofType(GiffiesActionsE.GET_GIFFIES),
      switchMap(() =>
        this.giffiesService.getGiffies().pipe(
          map((giffies) => {
            const { pagination, data } = giffies;
            const payload = { pagination, data };
            return { type: GiffiesActionsE.SAVE_GIFFIES, payload };
          }),
          catchError(() => EMPTY)
        )
      )
    )
  );

  constructor(
    private actions$: Actions,
    private giffiesService: GiffiesService
  ) {}
}
