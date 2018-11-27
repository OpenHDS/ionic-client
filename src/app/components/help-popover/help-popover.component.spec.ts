import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HelpPopoverComponent } from './help-popover.component';

describe('HelpPopoverComponent', () => {
  let component: HelpPopoverComponent;
  let fixture: ComponentFixture<HelpPopoverComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HelpPopoverComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HelpPopoverComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
