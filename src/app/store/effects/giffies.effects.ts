import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { EMPTY } from 'rxjs';
import { map, switchMap, catchError } from 'rxjs/operators';
import { GifT } from 'src/app/components/giffy/types';
import { GiffiesService } from 'src/app/services/giffies.service';
import { GiffiesActionsE } from '../actions/enums';
import { SaveGiffiesPayloadT } from '../actions/types';

@Injectable()
export class GiffiesEffects {
  getGiffies$ = createEffect(() =>
    this.actions$.pipe(
      ofType(GiffiesActionsE.GET_GIFFIES),
      switchMap(() =>
        this.giffiesService.getGiffies().pipe(
          map((res) => {
            const { pagination, data } = res;

            const giffies: GifT[] = [];
            data.forEach((gif) =>
              giffies.push({
                id: gif.id,
                slug: gif.slug,
                url: gif.images.fixed_width.webp,
              })
            );

            const payload: SaveGiffiesPayloadT = { pagination, data: giffies };

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
