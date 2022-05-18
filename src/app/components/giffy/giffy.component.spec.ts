import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GiffyComponent } from './giffy.component';

describe('GiffyComponent', () => {
  let component: GiffyComponent;
  let fixture: ComponentFixture<GiffyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [GiffyComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GiffyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
