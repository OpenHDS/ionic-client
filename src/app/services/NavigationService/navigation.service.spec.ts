import { TestBed, inject } from '@angular/core/testing';

import { NavigationServiceService } from './navigation.service';

describe('NavigationServiceService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [NavigationServiceService]
    });
  });

  it('should be created', inject([NavigationServiceService], (service: NavigationServiceService) => {
    expect(service).toBeTruthy();
  }));
});
