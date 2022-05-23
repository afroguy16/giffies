import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { map, switchMap, catchError } from 'rxjs/operators';
import { GifT } from 'src/app/components/giffy/types';
import { GiffiesService } from 'src/app/services/giffies.service';
import { GiffiesActionsE } from '../actions/enums';
import { errorGiffies, getGiffies } from '../actions/giffies.actions';
import { RequestPayloadT, SaveGiffiesPayloadT } from '../actions/types';

export const DEFAULT_ERROR_MESSAGE =
  'Something went wrong, please try again after some time';

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
          catchError(() => of(errorGiffies({ message: DEFAULT_ERROR_MESSAGE })))
        );
      })
    )
  );

  constructor(
    private actions$: Actions,
    private giffiesService: GiffiesService
  ) {}
}
