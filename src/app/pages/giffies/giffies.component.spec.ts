import {
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick,
} from '@angular/core/testing';
import { StoreModule } from '@ngrx/store';
import { By } from '@angular/platform-browser';

import * as fromRoot from '../../store/reducers/giffies.reducer';
import { giffies, giffiesResponse } from 'src/app/mocks/giffies';

import { GiffyComponent } from 'src/app/components/giffy/giffy.component';
import { GiffiesComponent } from './giffies.component';
import { GiffiesResponseT } from 'src/app/services/types';
import { createSpyFromClass, Spy } from 'jasmine-auto-spies';
import { GiffiesService } from 'src/app/services/giffies.service';
import { of } from 'rxjs';
import { EffectsModule } from '@ngrx/effects';
import { GiffiesEffects } from 'src/app/store/effects/giffies.effects';

const COUNT = 9; //per page according to the requirement
const FAKE_RES_ID = 'some random string';

describe('GiffiesComponent', () => {
  let component: GiffiesComponent;
  let fixture: ComponentFixture<GiffiesComponent>;
  let nativeElement: HTMLElement;

  let giffiesServiceSpy: Spy<GiffiesService>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      teardown: { destroyAfterEach: true },
      declarations: [GiffiesComponent, GiffyComponent],
      imports: [
        StoreModule.forRoot({ giffies: fromRoot.giffiesReducer }),
        EffectsModule.forRoot([GiffiesEffects]),
      ],
      providers: [
        {
          provide: GiffiesService,
          useValue: createSpyFromClass(GiffiesService),
        },
      ],
    }).compileComponents();
    giffiesServiceSpy = TestBed.inject<any>(GiffiesService);
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GiffiesComponent);
    component = fixture.componentInstance;
    nativeElement = fixture.debugElement.nativeElement;
  });

  it('should return a list of giffies on successful search', fakeAsync(() => {
    const payload: GiffiesResponseT = {
      pagination: { offset: 0, total_count: [...giffies].length, count: COUNT },
      data: [...giffiesResponse],
      meta: { msg: 'OK', status: 200, response_id: FAKE_RES_ID },
    };
    giffiesServiceSpy.getGiffies.and.returnValue(of(payload));

    const searchBox = fixture.debugElement.query(By.css('input[type="text"]'));
    let giffyElements = nativeElement.querySelectorAll('li');

    expect(giffyElements.length).toBe(0);

    searchBox.nativeElement.value = 'hippy';
    searchBox.nativeElement.dispatchEvent(new Event('keyup'));
    fixture.detectChanges();

    tick(500);
    fixture.detectChanges();
    giffyElements = nativeElement.querySelectorAll('li');

    expect(giffiesServiceSpy.getGiffies).toHaveBeenCalledTimes(1);
    expect(giffyElements.length).toBe(9);
  }));
});
