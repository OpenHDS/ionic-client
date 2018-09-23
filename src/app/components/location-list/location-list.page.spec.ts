import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LocationListPage } from './location-list.page';

describe('LocationListPage', () => {
  let component: LocationListPage;
  let fixture: ComponentFixture<LocationListPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LocationListPage ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LocationListPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
