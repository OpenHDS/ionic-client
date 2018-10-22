import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DataEntryApprovalPage } from './data-entry-approval.page';

describe('DataEntryApprovalPage', () => {
  let component: DataEntryApprovalPage;
  let fixture: ComponentFixture<DataEntryApprovalPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DataEntryApprovalPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DataEntryApprovalPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
