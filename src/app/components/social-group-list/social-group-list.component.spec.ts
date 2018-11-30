import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SocialGroupListComponent } from './social-group-list.component';

describe('SocialGroupComponentComponent', () => {
  let component: SocialGroupListComponent;
  let fixture: ComponentFixture<SocialGroupListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SocialGroupListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SocialGroupListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
