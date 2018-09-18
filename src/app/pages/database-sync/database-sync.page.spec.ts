import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DatabaseSyncPage } from './database-sync.page';

describe('DatabaseSyncPage', () => {
  let component: DatabaseSyncPage;
  let fixture: ComponentFixture<DatabaseSyncPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DatabaseSyncPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DatabaseSyncPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
