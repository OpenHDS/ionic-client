import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FieldworkerDashPage } from './fieldworker-dash.page';

describe('FieldworkerDashPage', () => {
  let component: FieldworkerDashPage;
  let fixture: ComponentFixture<FieldworkerDashPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FieldworkerDashPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FieldworkerDashPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
