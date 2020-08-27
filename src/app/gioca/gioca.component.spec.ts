import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GiocaComponent } from './gioca.component';

describe('GiocaComponent', () => {
  let component: GiocaComponent;
  let fixture: ComponentFixture<GiocaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GiocaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GiocaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
