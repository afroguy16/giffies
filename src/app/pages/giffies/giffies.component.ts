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
import { PaginationT } from 'src/app/services/types';
import { getGiffies } from 'src/app/store/actions/giffies.actions';
import { GiffiesState } from 'src/app/store/reducers/giffies.reducer';
import * as fromSelectors from '../../store/selectors/giffies.selectors';

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
    const query = (e.target as HTMLInputElement).value;
    this.searchValue$.next(query);
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
          this.store.dispatch(getGiffies({ payload: query }));
        }
      });
  }
}
