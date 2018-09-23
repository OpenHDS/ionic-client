import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BaselineCensusPage } from './baseline-census.page';

describe('BaselineCensusPage', () => {
  let component: BaselineCensusPage;
  let fixture: ComponentFixture<BaselineCensusPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BaselineCensusPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BaselineCensusPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
