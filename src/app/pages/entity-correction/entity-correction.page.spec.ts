import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EntityCorrectionPage } from './entity-correction.page';

describe('EntityCorrectionPage', () => {
  let component: EntityCorrectionPage;
  let fixture: ComponentFixture<EntityCorrectionPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EntityCorrectionPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EntityCorrectionPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
