import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GiffyComponent } from './giffy.component';
import { GifT } from './types';

const FAKE_DATA: GifT = {
  id: 'fake ID',
  url: 'https://giphy.com/clips/buzzfeed-donuts-national-donut-day-mochi-lJHUX2GE4BMqeVHEtY',
  slug: 'fake slug',
};

describe('GiffyComponent', () => {
  let fixture: ComponentFixture<GiffyComponent>;
  let component: GiffyComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [GiffyComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GiffyComponent);
    component = fixture.componentInstance;
    component.props = FAKE_DATA;
    fixture.detectChanges();
  });

  it('should display an image which is equal to the prop image passed', () => {
    const imageElement =
      fixture.debugElement.nativeElement.querySelector('img');
    expect(imageElement.src).toBe(FAKE_DATA.url);
    expect(imageElement.alt).toBe(FAKE_DATA.slug);
  });
});
