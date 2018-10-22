import { TestBed, inject } from '@angular/core/testing';

import { SynchonizationObservableService } from './synchonization-observable.service';

describe('SynchonizationObservableService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SynchonizationObservableService]
    });
  });

  it('should be created', inject([SynchonizationObservableService], (service: SynchonizationObservableService) => {
    expect(service).toBeTruthy();
  }));
});
