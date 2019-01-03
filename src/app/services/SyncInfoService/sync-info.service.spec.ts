import { TestBed } from '@angular/core/testing';

import { SyncInfoService } from './sync-info.service';

describe('SyncInfoService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SyncInfoService = TestBed.get(SyncInfoService);
    expect(service).toBeTruthy();
  });
});
