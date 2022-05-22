import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { PaginationControlComponent } from './pagination-control.component';
import { PaginationControlPropsT } from './types';

const FAKE_PROPS: PaginationControlPropsT = { perPage: 9, count: 90 };
const FAKE_PAGE_COUNT = FAKE_PROPS.count / FAKE_PROPS.perPage; //This will break if it has a remainder
const FAKE_PAGINATION_LENGTH = 20;

@Component({
  selector: `host-component-with-less-than-two-pages`,
  template: `<app-pagination-control
    [props]="fakeProps"
  ></app-pagination-control>`,
})
class TestHostComponentWithLessThanTwoPages {
  fakeProps: PaginationControlPropsT = { ...FAKE_PROPS, perPage: 90 };
}

describe('PaginationControlComponent with Less than two pages', () => {
  let fixture: ComponentFixture<TestHostComponentWithLessThanTwoPages>;
  let nativeElement: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        PaginationControlComponent,
        TestHostComponentWithLessThanTwoPages,
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TestHostComponentWithLessThanTwoPages);
    nativeElement = fixture.debugElement.nativeElement;
    fixture.detectChanges();
  });

  it('should render a list of items based on the total count and perpage props', () => {
    let pageNumberLinkElements = nativeElement.querySelectorAll(
      '[aria-label="page-number"]'
    );
    expect(pageNumberLinkElements.length).toBe(1);
  });

  it('should render a previous and next button if it has more than two available pages', () => {
    let previousButtonElement = nativeElement.querySelector(
      '[aria-label="previous"]'
    );
    let nextButtonElement = nativeElement.querySelector('[aria-label="next"]');

    expect(previousButtonElement).toBeFalsy();
    expect(nextButtonElement).toBeFalsy();
  });
});

@Component({
  selector: `host-component-two-pages`,
  template: `<app-pagination-control
    [props]="fakeProps"
    (selectActivePageNumber)="mockActivePageListener($event)"
  ></app-pagination-control>`,
})
class TestHostComponentWithMoreThanTwoPages {
  fakeProps = { ...FAKE_PROPS };

  mockActivePageListener(e: number) {}
}

describe('PaginationControlComponent - Host with two pages', () => {
  let component: TestHostComponentWithMoreThanTwoPages;
  let fixture: ComponentFixture<TestHostComponentWithMoreThanTwoPages>;
  let nativeElement: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        PaginationControlComponent,
        TestHostComponentWithMoreThanTwoPages,
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TestHostComponentWithMoreThanTwoPages);
    component = fixture.componentInstance;
    nativeElement = fixture.debugElement.nativeElement;
    fixture.detectChanges();
  });

  it('should render a list of items based on the total count and perpage props', () => {
    let pageNumberLinkElements = nativeElement.querySelectorAll(
      '[aria-label="page-number"]'
    );
    expect(pageNumberLinkElements.length).toBe(FAKE_PAGE_COUNT);
  });

  it('should render a previous and next button if it has more than two available pages', () => {
    let previousButtonElement = nativeElement.querySelector(
      '[aria-label="previous"]'
    );
    let nextButtonElement = nativeElement.querySelector('[aria-label="next"]');

    expect(previousButtonElement).toBeTruthy();
    expect(nextButtonElement).toBeTruthy();
  });

  it('should emit an event with the number clicked if a page number, previous or next link is selected', () => {
    const mockActivePageListenerSpy = spyOn(
      component,
      'mockActivePageListener'
    ).and.callThrough();
    const pageSelectorElements = nativeElement.querySelectorAll('li');
    const previousPageNumberLinkElement = pageSelectorElements[0];
    const thirdPageNumberLinkElement = pageSelectorElements[3];
    const nextPageNumberLinkElement = pageSelectorElements[FAKE_PAGE_COUNT + 1];

    nextPageNumberLinkElement.click();
    expect(mockActivePageListenerSpy).toHaveBeenCalledWith(2);

    previousPageNumberLinkElement.click();
    expect(mockActivePageListenerSpy).toHaveBeenCalledWith(1);

    thirdPageNumberLinkElement.click();
    expect(mockActivePageListenerSpy).toHaveBeenCalledWith(3);
  });

  it('should not emit an event if previous link is clicked on page one', () => {
    const mockActivePageListenerSpy = spyOn(
      component,
      'mockActivePageListener'
    );
    const pageSelectorElements = nativeElement.querySelectorAll('li');
    const previousPageNumberLinkElement = pageSelectorElements[0];

    previousPageNumberLinkElement.click();
    expect(mockActivePageListenerSpy).not.toHaveBeenCalled();
  });
});

describe('PaginationControlComponent with more than ten pages', () => {
  let component: PaginationControlComponent;
  let fixture: ComponentFixture<PaginationControlComponent>;
  let nativeElement: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PaginationControlComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PaginationControlComponent);
    component = fixture.componentInstance;
    nativeElement = fixture.debugElement.nativeElement;
    component.props = { ...FAKE_PROPS, count: 181 };
    fixture.detectChanges();
  });

  it('should render a max of ten page list elements', () => {
    const pageNumberLinkElements = nativeElement.querySelectorAll(
      '[aria-label="page-number"]'
    );
    expect(pageNumberLinkElements.length).toBe(FAKE_PAGE_COUNT);
  });

  it('the start and last page number should move a step further in relation to how far the active page is once active page number is more than six', () => {
    const pageSelectorElements = nativeElement.querySelectorAll('li');
    const previousPageNumberLinkElement = pageSelectorElements[0];
    const nextPageNumberLinkElement = pageSelectorElements[FAKE_PAGE_COUNT + 1];
    const firstPageNumberLinkElement = pageSelectorElements[1];
    let seventhPageNumberLinkElement = pageSelectorElements[7];
    const lastPageNumberLinkElement = pageSelectorElements[FAKE_PAGE_COUNT];

    expect(firstPageNumberLinkElement.innerText).toContain('1');
    expect(lastPageNumberLinkElement.innerText).toContain(
      FAKE_PAGE_COUNT.toString()
    );

    seventhPageNumberLinkElement.click();
    fixture.detectChanges();
    expect(firstPageNumberLinkElement.innerText).not.toContain('1');
    expect(firstPageNumberLinkElement.innerText).toContain('2');
    expect(lastPageNumberLinkElement.innerText).not.toContain(
      FAKE_PAGE_COUNT.toString()
    );
    expect(lastPageNumberLinkElement.innerText).toContain('11'); //Eleventh page once page 7 is active

    nextPageNumberLinkElement.click();
    fixture.detectChanges();
    expect(firstPageNumberLinkElement.innerText).not.toContain('2');
    expect(firstPageNumberLinkElement.innerText).toContain('3');
    expect(lastPageNumberLinkElement.innerText).not.toContain('11');
    expect(lastPageNumberLinkElement.innerText).toContain('12'); //Twelveth page once page 8 is active

    seventhPageNumberLinkElement = pageSelectorElements[5]; //Seventh page link is currently in the fifth possition, because the pagination has moved two steps forward
    seventhPageNumberLinkElement.click();
    fixture.detectChanges();
    expect(firstPageNumberLinkElement.innerText).not.toContain('1');
    expect(firstPageNumberLinkElement.innerText).toContain('2');
    expect(lastPageNumberLinkElement.innerText).not.toContain(
      FAKE_PAGE_COUNT.toString()
    );
    expect(lastPageNumberLinkElement.innerText).toContain('11'); //Eleventh page once page 7 is active

    previousPageNumberLinkElement.click(); //move one step back so 6th page becomes active
    fixture.detectChanges();
    expect(firstPageNumberLinkElement.innerText).toContain('1');
    expect(lastPageNumberLinkElement.innerText).toContain(
      FAKE_PAGE_COUNT.toString()
    );
  });

  it('should  not truncate if a page number in the last part of the list is active', () => {
    let pageSelectorElements = nativeElement.querySelectorAll('li');
    const nextPageNumberLinkElement = pageSelectorElements[FAKE_PAGE_COUNT + 1];
    let tenthPageNumberLinkElement = pageSelectorElements[10];

    expect(pageSelectorElements.length).toBe(12);
    tenthPageNumberLinkElement.click();
    nextPageNumberLinkElement.click();
    nextPageNumberLinkElement.click();
    nextPageNumberLinkElement.click();
    nextPageNumberLinkElement.click();
    nextPageNumberLinkElement.click();
    nextPageNumberLinkElement.click();
    nextPageNumberLinkElement.click();
    nextPageNumberLinkElement.click(); //check to see if the length will when the last part of the list is active
    fixture.detectChanges();

    pageSelectorElements = nativeElement.querySelectorAll('li');
    expect(pageSelectorElements.length).toBe(12);
  });
});

@Component({
  selector: `host-component-with-pagination-length`,
  template: `<app-pagination-control
    [props]="fakeProps"
    (selectActivePageNumber)="mockActivePageListener($event)"
  ></app-pagination-control>`,
})
class TestHostComponentWithPaginationLength {
  fakeProps: PaginationControlPropsT = {
    ...FAKE_PROPS,
    count: 180,
    paginationLength: FAKE_PAGINATION_LENGTH,
  };
}

describe('PaginationControlComponent -  Host with pagination length props', () => {
  let component: TestHostComponentWithPaginationLength;
  let fixture: ComponentFixture<TestHostComponentWithPaginationLength>;
  let nativeElement: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        PaginationControlComponent,
        TestHostComponentWithPaginationLength,
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TestHostComponentWithPaginationLength);
    component = fixture.componentInstance;
    nativeElement = fixture.debugElement.nativeElement;
    fixture.detectChanges();
  });

  it('should render a max of ten page list elements', () => {
    const pageNumberLinkElements = nativeElement.querySelectorAll(
      '[aria-label="page-number"]'
    );
    expect(pageNumberLinkElements.length).toBe(FAKE_PAGINATION_LENGTH); //the same
  });
});

// I am seperating the Paginationation test with out Host when I need to access its Fixture quickly instead of tangling it with the Host Fixtures and Component, so it is clear what is being tested
describe('PaginationControlComponent Test without Host', () => {
  let component: PaginationControlComponent;
  let fixture: ComponentFixture<PaginationControlComponent>;
  let nativeElement: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PaginationControlComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PaginationControlComponent);
    component = fixture.componentInstance;
    nativeElement = fixture.debugElement.nativeElement;
    component.props = { ...FAKE_PROPS };
    fixture.detectChanges();
  });

  it('should not emit an event if next link is clicked on the last page', () => {
    const activePageListenerSpy = spyOn(
      component.selectActivePageNumber,
      'emit'
    );
    const pageSelectorElements = nativeElement.querySelectorAll('li');
    const lastPageNumberLinkElement = pageSelectorElements[FAKE_PAGE_COUNT];
    const nextPageNumberLinkElement = pageSelectorElements[FAKE_PAGE_COUNT + 1];

    lastPageNumberLinkElement.click();
    nextPageNumberLinkElement.click();
    expect(activePageListenerSpy).toHaveBeenCalledTimes(1);
  });

  it('Previous link should be inactive if first page is active and Next link should be inactive if last page is active', () => {
    const pageSelectorElements = nativeElement.querySelectorAll('li');
    const lastPageNumberLinkElement = pageSelectorElements[FAKE_PAGE_COUNT];
    const previousPageNumberLinkElement = pageSelectorElements[0];
    const nextPageNumberLinkElement = pageSelectorElements[FAKE_PAGE_COUNT + 1];
    let disabledLinkElements = fixture.debugElement.queryAll(
      By.css('.disabled')
    );

    expect(previousPageNumberLinkElement).toHaveClass('disabled');
    expect(disabledLinkElements.length).toBe(1);

    lastPageNumberLinkElement.click();
    fixture.detectChanges();
    expect(nextPageNumberLinkElement).toHaveClass('disabled');
    expect(disabledLinkElements.length).toBe(1);
  });

  it('selected number should be active', () => {
    const pageSelectorElements = nativeElement.querySelectorAll('li');
    const previousPageNumberLinkElement = pageSelectorElements[0];
    const nextPageNumberLinkElement = pageSelectorElements[FAKE_PAGE_COUNT + 1];
    const firstPageNumberLinkElement = pageSelectorElements[1];
    const secondPageNumberLinkElement = pageSelectorElements[2];
    const thirdPageNumberLinkElement = pageSelectorElements[3];

    nextPageNumberLinkElement.click();
    fixture.detectChanges();
    let activeLinkElements = fixture.debugElement.queryAll(By.css('.active'));
    expect(secondPageNumberLinkElement).toHaveClass('active');
    expect(activeLinkElements.length).toBe(1); //only one should be active

    previousPageNumberLinkElement.click();
    fixture.detectChanges();
    activeLinkElements = fixture.debugElement.queryAll(By.css('.active'));
    expect(firstPageNumberLinkElement).toHaveClass('active');
    expect(activeLinkElements.length).toBe(1); //only one should be active

    thirdPageNumberLinkElement.click();
    fixture.detectChanges();
    activeLinkElements = fixture.debugElement.queryAll(By.css('.active'));
    expect(thirdPageNumberLinkElement).toHaveClass('active');
    expect(activeLinkElements.length).toBe(1); //only one should be active
  });
});
