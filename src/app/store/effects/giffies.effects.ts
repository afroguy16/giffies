import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { EMPTY } from 'rxjs';
import { map, switchMap, catchError } from 'rxjs/operators';
import { GifT } from 'src/app/components/giffy/types';
import { LocaleE, RatingE } from 'src/app/services/enums';
import { GiffiesService } from 'src/app/services/giffies.service';
import { RequestPayloadT } from 'src/app/services/types';
import { GiffiesActionsE } from '../actions/enums';
import { getGiffies } from '../actions/giffies.actions';
import { SaveGiffiesPayloadT } from '../actions/types';

@Injectable()
export class GiffiesEffects {
  getGiffies$ = createEffect(() =>
    this.actions$.pipe(
      ofType(getGiffies),
      switchMap(({ payload: { query, offset, limit, lang, rating } }) => {
        const modifiedPayload: RequestPayloadT = {
          query,
          offset,
          limit,
          lang,
          rating,
        };

        return this.giffiesService.getGiffies(modifiedPayload).pipe(
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
        );
      })
    )
  );

  constructor(
    private actions$: Actions,
    private giffiesService: GiffiesService
  ) {}
}
