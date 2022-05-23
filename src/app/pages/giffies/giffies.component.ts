import {
  Component,
  ChangeDetectionStrategy,
  OnInit,
  OnDestroy,
  ChangeDetectorRef,
} from '@angular/core';
import { Actions, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import {
  BehaviorSubject,
  debounce,
  distinctUntilChanged,
  interval,
  Observable,
  takeWhile,
} from 'rxjs';

import { GifT } from 'src/app/components/giffy/types';
import { LocaleE, RatingE } from 'src/app/services/enums';
import { PaginationT } from 'src/app/services/types';
import {
  errorGiffies,
  getGiffies,
} from 'src/app/store/actions/giffies.actions';
import { GiffiesState } from 'src/app/store/reducers/giffies.reducer';
import * as fromSelectors from '../../store/selectors/giffies.selectors';

const LIMIT = 9; //number per page according to the requirement
const RATING = RatingE.G; //default rating, this can be changed if I want to extend the functionality to allow users select rating
const LANG = LocaleE.EN; //default locale, this can be changed if I want to extend the functionality to allow users select locale

@Component({
  selector: 'app-giffies',
  templateUrl: './giffies.component.html',
  styleUrls: ['./giffies.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GiffiesComponent implements OnInit, OnDestroy {
  giffies$: Observable<GifT[]>;
  pagination$: Observable<PaginationT>;
  searchValue$ = new BehaviorSubject('');
  alive = true;
  activePageNumber = 1;
  query = '';
  error = '';
  searchInit = false;

  constructor(
    private ref: ChangeDetectorRef,
    private store: Store<{ giffies: GiffiesState }>,
    private actions$: Actions
  ) {}

  ngOnInit(): void {
    this.subscribeToError();
    this.subscribeToSearch();
    this.connectToStoreData();
  }

  ngOnDestroy(): void {
    this.alive = false;
  }

  private connectToStoreData() {
    this.giffies$ = this.store.select(fromSelectors.selectGiffiesCollection);
    this.pagination$ = this.store.select(fromSelectors.selectGiffiesPagination);
  }

  private search(query: string) {
    if (this.error !== '') {
      this.resetError();
      this.ref.detectChanges();
    }

    if (!this.searchInit) this.searchInit = true;

    this.store.dispatch(
      getGiffies({
        payload: {
          query,
          limit: LIMIT,
          offset:
            this.activePageNumber <= 1 ? 0 : LIMIT * this.activePageNumber - 1,
          rating: RATING,
          lang: LANG,
        },
      })
    );
  }

  private subscribeToSearch() {
    this.searchValue$
      .pipe(
        debounce(() => interval(500)),
        distinctUntilChanged(),
        takeWhile(() => this.alive)
      )
      .subscribe((query) => {
        if (query !== '') {
          this.query = query;
          this.search(this.query);
        }
      });
  }

  private subscribeToError() {
    this.actions$
      .pipe(
        ofType(errorGiffies),
        takeWhile(() => this.alive)
      )
      .subscribe((action) => {
        this.error = action.message;
        this.ref.detectChanges();
      });
  }

  onSelectActivePageNumber(newActivePageNumber: number) {
    this.activePageNumber = newActivePageNumber;
    this.search(this.query);
  }

  resetError() {
    this.error = '';
  }

  trackGiffies(index: number, giffies: GifT) {
    return giffies.id;
  }

  searchGiffies(e: Event) {
    this.activePageNumber = 1;
    const query = (e.target as HTMLInputElement).value;
    this.searchValue$.next(query);
  }
}
