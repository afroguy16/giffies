import {
  Component,
  ChangeDetectionStrategy,
  OnInit,
  OnDestroy,
  ChangeDetectorRef,
} from '@angular/core';
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
import { getGiffies } from 'src/app/store/actions/giffies.actions';
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

  constructor(
    private ref: ChangeDetectorRef,
    private store: Store<{ giffies: GiffiesState }>
  ) {}

  ngOnInit(): void {
    this.subscribeToSearch();
    this.setStoreData();
  }

  ngOnDestroy(): void {
    this.alive = false;
  }

  private setStoreData() {
    this.giffies$ = this.store.select(fromSelectors.selectGiffiesCollection);
    this.pagination$ = this.store.select(fromSelectors.selectGiffiesPagination);
  }

  trackGiffies(index: number, giffies: GifT) {
    return giffies.id;
  }

  searchGiffies(e: Event) {
    this.activePageNumber = 1;
    const query = (e.target as HTMLInputElement).value;
    this.searchValue$.next(query);
  }

  private search(query: string) {
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

  subscribeToSearch() {
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

  onSelectActivePageNumber(newActivePageNumber: number) {
    this.activePageNumber = newActivePageNumber;
    this.search(this.query);
  }
}
