import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { PaginationControlPropsT } from './types';

@Component({
  selector: 'app-pagination-control',
  templateUrl: './pagination-control.component.html',
  styleUrls: ['./pagination-control.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PaginationControlComponent {
  @Input() props: PaginationControlPropsT;
  @Output() selectActivePageNumber: EventEmitter<number> = new EventEmitter();
  activePageNumber = 1;

  hasMoreThanTwoPages() {
    return this.getRoundedPageCount() > 1;
  }

  getRoundedPageCount() {
    return Math.ceil(this.props.count / this.props.perPage);
  }

  getPageRange() {
    const rangeArray = [...Array(this.getRoundedPageCount()).keys()]; //fill Array from 0 - rounded page number

    const lastActiveBeforeSlice = 6;
    const distanceFromLastActiveBeforeSlice =
      this.activePageNumber - lastActiveBeforeSlice;
    let slicedArray: number[] = [];
    if (this.getRoundedPageCount() <= 10) {
      slicedArray = rangeArray;
    } else {
      slicedArray =
        this.activePageNumber <= lastActiveBeforeSlice
          ? rangeArray.slice(0, 10)
          : rangeArray.slice(
              distanceFromLastActiveBeforeSlice,
              rangeArray[10 + distanceFromLastActiveBeforeSlice]
            );
    }
    return slicedArray;
  }

  trackGiffies(index: number) {
    return index;
  }

  onSelectNextPage() {
    this.activePageNumber < this.getRoundedPageCount() &&
      this.onSelectActivePageNumber(this.activePageNumber + 1);
  }

  onSelectPreviousPage() {
    this.activePageNumber > 1 &&
      this.onSelectActivePageNumber(this.activePageNumber - 1);
  }

  onSelectActivePageNumber(newActivePageNumber: number) {
    this.activePageNumber = newActivePageNumber;
    this.selectActivePageNumber.emit(this.activePageNumber);
  }

  isActivePage(pageNumber: number) {
    return pageNumber === this.activePageNumber;
  }

  getPageActiveClass(pageNumber: number) {
    return this.isActivePage(pageNumber) ? 'active' : '';
  }
}
