import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateSocialGroupPage } from './create-social-group.page';

describe('CreateSocialGroupPage', () => {
  let component: CreateSocialGroupPage;
  let fixture: ComponentFixture<CreateSocialGroupPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateSocialGroupPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateSocialGroupPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
