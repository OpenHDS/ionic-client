import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SocialGroupComponentComponent } from './social-group-list.component';

describe('SocialGroupComponentComponent', () => {
  let component: SocialGroupComponentComponent;
  let fixture: ComponentFixture<SocialGroupComponentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SocialGroupComponentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SocialGroupComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
