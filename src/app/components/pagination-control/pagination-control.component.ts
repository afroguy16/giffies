import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { PaginationControlPropsT } from './types';

const DEFAULT_PAGINATION_LENGTH = 10; //inspired by Google's pagination length

@Component({
  selector: 'app-pagination-control',
  templateUrl: './pagination-control.component.html',
  styleUrls: ['./pagination-control.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PaginationControlComponent implements OnInit {
  @Input() props: PaginationControlPropsT;
  @Output() selectActivePageNumber: EventEmitter<number> = new EventEmitter();
  activePageNumber = 1;
  private defaultPaginationLength = DEFAULT_PAGINATION_LENGTH;
  private paginationLength: number;

  ngOnInit(): void {
    this.paginationLength =
      this.props.paginationLength && this.props.paginationLength > 0
        ? this.props.paginationLength
        : this.defaultPaginationLength; //override default if provided by Parent component
  }

  hasMoreThanTwoPages() {
    return this.getRoundedPageCount() > 1;
  }

  getRoundedPageCount() {
    return Math.ceil(this.props.count / this.props.perPage);
  }

  // I had to write a bunch of comments here because this is very low level work that should be done in a Library, and not part of the application
  getPageRange() {
    const rangeArray = [...Array(this.getRoundedPageCount()).keys()]; //fill Array from 0 - rounded page number
    const lastActiveBeforeSlice = this.paginationLength / 2 + 1; //one number after half of pagination length
    const lastPageNumbersInTheList =
      this.paginationLength - lastActiveBeforeSlice; //this is the remnant after slicing starts
    const distanceFromLastActiveBeforeSlice =
      this.activePageNumber - lastActiveBeforeSlice;
    let slicedArray: number[] = [];

    if (this.getRoundedPageCount() <= this.paginationLength) {
      //return every list item if it's less than the pagination length
      slicedArray = rangeArray;
    } else if (
      rangeArray.length - this.activePageNumber <
      lastPageNumbersInTheList
    ) {
      //if it's at the last part of the array
      slicedArray = rangeArray.slice(
        rangeArray[rangeArray.length - this.paginationLength]
      ); //keep the array length intact e.g rangelength = 200, and pagination length = 10, slicing will start from 190, and it will preserve the length of the array. If this is taken out, the array will starting shrinking when it gets to the last parts of the array
    } else {
      slicedArray =
        this.activePageNumber <= lastActiveBeforeSlice
          ? rangeArray.slice(0, this.paginationLength) //if the active number is less than or equal to the item before slicing should occur, then slice from the beginning to the array length
          : rangeArray.slice(
              distanceFromLastActiveBeforeSlice,
              rangeArray[
                this.paginationLength + distanceFromLastActiveBeforeSlice
              ] //else start slicing from how far the index has passed the distance before slice, this will increment by one. Then add that distance to the pagination length. This will keep moving the numbers to be displayed forward
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
    if (this.activePageNumber === newActivePageNumber) return;
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
