import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SystemConfigPage } from './system-config.page';

describe('SystemConfigPage', () => {
  let component: SystemConfigPage;
  let fixture: ComponentFixture<SystemConfigPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SystemConfigPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SystemConfigPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
