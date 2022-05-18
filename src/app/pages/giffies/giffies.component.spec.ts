import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GiffyComponent } from 'src/app/components/giffy/giffy.component';
import { giffies } from 'src/app/mocks/giffies';

import { GiffiesComponent } from './giffies.component';

const FAKE_GIFFIES = [...giffies];

describe('GiffiesComponent', () => {
  let component: GiffiesComponent;
  let fixture: ComponentFixture<GiffiesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [GiffiesComponent, GiffyComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GiffiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should show a list of giffies that is the same with the giffies past as props', () => {
    const giffyElements =
      fixture.debugElement.nativeElement.querySelectorAll('li');
    expect(giffyElements.length).toBe(FAKE_GIFFIES.length);
  });
});
