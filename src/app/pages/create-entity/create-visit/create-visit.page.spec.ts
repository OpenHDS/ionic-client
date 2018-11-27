import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateVisitPage } from './create-visit.page';

describe('CreateVisitPage', () => {
  let component: CreateVisitPage;
  let fixture: ComponentFixture<CreateVisitPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateVisitPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateVisitPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
