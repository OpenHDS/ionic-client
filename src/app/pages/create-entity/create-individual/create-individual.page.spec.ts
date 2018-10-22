import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateIndividualPage } from './create-individual.page';

describe('CreateIndividualPage', () => {
  let component: CreateIndividualPage;
  let fixture: ComponentFixture<CreateIndividualPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateIndividualPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateIndividualPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
