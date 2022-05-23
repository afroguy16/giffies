import { ComponentFixture, TestBed } from '@angular/core/testing';
import { giffies } from 'src/app/mocks/giffies';
import { GiffyComponent } from './giffy.component';

const FAKE_DATA = { ...giffies[0] };

describe('GiffyComponent', () => {
  let fixture: ComponentFixture<GiffyComponent>;
  let component: GiffyComponent;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [GiffyComponent],
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GiffyComponent);
    component = fixture.componentInstance;
    component.props = { ...FAKE_DATA };
    fixture.detectChanges();
  });

  it('should display an image which is equal to the prop image passed', () => {
    const imageElement =
      fixture.debugElement.nativeElement.querySelector('img');
    expect(imageElement.src).toBe(FAKE_DATA.url);
    expect(imageElement.alt).toBe(FAKE_DATA.slug);
  });
});
