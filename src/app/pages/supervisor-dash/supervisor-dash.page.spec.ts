import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SupervisorDashPage } from './supervisor-dash.page';

describe('SupervisorDashPage', () => {
  let component: SupervisorDashPage;
  let fixture: ComponentFixture<SupervisorDashPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SupervisorDashPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SupervisorDashPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
